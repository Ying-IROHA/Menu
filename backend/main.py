"""Nocturne bar menu backend.

Serves the JSON API under /api/* and the existing static frontend (the
Menu/ folder) at the root path, so the whole app runs from a single
`uvicorn main:app` process.
"""
import os
import secrets
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from sqlalchemy import func
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, SessionLocal, engine, get_db
from seed_data import OFF_MENU_ITEM, seeded_cocktails

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.normpath(os.path.join(BASE_DIR, "..", "Menu"))

Base.metadata.create_all(bind=engine)


def seed_if_empty():
    db = SessionLocal()
    try:
        if db.query(models.Cocktail).count() == 0:
            for row in seeded_cocktails():
                db.add(models.Cocktail(**row))
            db.commit()
    finally:
        db.close()


seed_if_empty()

app = FastAPI(title="Nocturne Bar Menu API")

# Same-origin by default (frontend is served by this same app), but CORS is
# left open so the API can also be called from another host during
# development. Tighten this if you deploy the API publicly on its own.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Admin auth — one shared username/password (HTTP Basic) protects the admin
# page and every write to the menu. Read the credentials from environment
# variables so nothing sensitive ever lives in source control; set
# ADMIN_USERNAME / ADMIN_PASSWORD before starting the server in production
# (see the root README). The fallback below is only for local testing.
# ---------------------------------------------------------------------------

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "nocturne")
ADMIN_REALM = "Nocturne Admin"

security = HTTPBasic()


def require_admin(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    valid_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    valid_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (valid_username and valid_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": f'Basic realm="{ADMIN_REALM}"'},
        )
    return credentials.username


# ---------------------------------------------------------------------------
# Cocktails (the public menu + admin-managed source of truth)
# ---------------------------------------------------------------------------

@app.get("/api/cocktails", response_model=List[schemas.CocktailOut])
def list_cocktails(db: Session = Depends(get_db)):
    return db.query(models.Cocktail).order_by(models.Cocktail.name.collate("NOCASE")).all()


@app.get("/api/cocktails/{cocktail_id}", response_model=schemas.CocktailOut)
def get_cocktail(cocktail_id: int, db: Session = Depends(get_db)):
    cocktail = db.get(models.Cocktail, cocktail_id)
    if not cocktail:
        raise HTTPException(status_code=404, detail="Cocktail not found")
    return cocktail


@app.post("/api/cocktails", response_model=schemas.CocktailOut, status_code=201)
def create_cocktail(
    payload: schemas.CocktailCreate,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin),
):
    existing = db.query(models.Cocktail).filter(models.Cocktail.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=409, detail="A cocktail with this name already exists")
    cocktail = models.Cocktail(**payload.model_dump())
    db.add(cocktail)
    db.commit()
    db.refresh(cocktail)
    return cocktail


@app.put("/api/cocktails/{cocktail_id}", response_model=schemas.CocktailOut)
def update_cocktail(
    cocktail_id: int,
    payload: schemas.CocktailUpdate,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin),
):
    cocktail = db.get(models.Cocktail, cocktail_id)
    if not cocktail:
        raise HTTPException(status_code=404, detail="Cocktail not found")
    duplicate = (
        db.query(models.Cocktail)
        .filter(models.Cocktail.name == payload.name, models.Cocktail.id != cocktail_id)
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=409, detail="A cocktail with this name already exists")
    for field, value in payload.model_dump().items():
        setattr(cocktail, field, value)
    db.commit()
    db.refresh(cocktail)
    return cocktail


@app.delete("/api/cocktails/{cocktail_id}", status_code=204)
def delete_cocktail(
    cocktail_id: int,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin),
):
    cocktail = db.get(models.Cocktail, cocktail_id)
    if not cocktail:
        raise HTTPException(status_code=404, detail="Cocktail not found")
    db.delete(cocktail)
    db.commit()
    return None


# ---------------------------------------------------------------------------
# Private ledger: quick-order catalog + orders (checkout history)
# ---------------------------------------------------------------------------

@app.get("/api/ledger/catalog", response_model=List[schemas.LedgerCatalogItem])
def ledger_catalog(db: Session = Depends(get_db)):
    cocktails = db.query(models.Cocktail).all()
    pinned = sorted(
        [c for c in cocktails if c.ledger_priority is not None],
        key=lambda c: c.ledger_priority,
    )
    unpinned = sorted(
        [c for c in cocktails if c.ledger_priority is None],
        key=lambda c: c.name.lower(),
    )

    catalog = [schemas.LedgerCatalogItem(**OFF_MENU_ITEM, is_off_menu=True)]
    for c in pinned + unpinned:
        # In the private ledger, signature cocktails are grouped under a
        # "Signature" quick-filter instead of their base spirit, matching
        # how the bartender's ordering tool has always grouped them.
        display_base = "Signature" if c.collection == "signature" else c.base
        catalog.append(
            schemas.LedgerCatalogItem(
                id=c.id, name=c.name, zh=c.zh, base=display_base, price=c.price, is_off_menu=False
            )
        )
    return catalog


def _resolve_catalog_item(db: Session, name: str):
    if name == OFF_MENU_ITEM["name"]:
        return OFF_MENU_ITEM["name"], OFF_MENU_ITEM["zh"], OFF_MENU_ITEM["price"]
    cocktail = db.query(models.Cocktail).filter(models.Cocktail.name == name).first()
    if not cocktail:
        raise HTTPException(status_code=400, detail=f"Unknown catalog item: {name}")
    return cocktail.name, cocktail.zh, cocktail.price


@app.get("/api/orders", response_model=List[schemas.OrderOut])
def list_orders(limit: int = 100, db: Session = Depends(get_db)):
    limit = max(1, min(limit, 500))
    return (
        db.query(models.Order)
        .order_by(models.Order.created_at.desc(), models.Order.id.desc())
        .limit(limit)
        .all()
    )


@app.post("/api/orders", response_model=schemas.OrderOut, status_code=201)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")
    if payload.discount not in (50, 55, 60, 65, 70, 75, 80, 85, 90, 100):
        raise HTTPException(status_code=400, detail="Invalid discount value")

    order_items = []
    subtotal = 0
    cups = 0
    for item in payload.items:
        name, zh, unit_price = _resolve_catalog_item(db, item.name)
        line_subtotal = unit_price * item.quantity
        subtotal += line_subtotal
        cups += item.quantity
        order_items.append(
            models.OrderItem(
                name=name, zh=zh, quantity=item.quantity, unit_price=unit_price, subtotal=line_subtotal
            )
        )

    total = round(subtotal * payload.discount / 100)

    order = models.Order(
        note=payload.note.strip()[:200],
        discount=payload.discount,
        cups=cups,
        subtotal=subtotal,
        total=total,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@app.delete("/api/orders/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(models.Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return None


# ---------------------------------------------------------------------------
# Guestbook — friends visiting the menu can leave a short public note.
# Reading and posting are open to everyone (that's the point); deleting a
# message is an admin-only moderation action.
# ---------------------------------------------------------------------------

@app.get("/api/guestbook", response_model=List[schemas.GuestbookMessageOut])
def list_guestbook_messages(limit: int = 200, db: Session = Depends(get_db)):
    limit = max(1, min(limit, 500))
    return (
        db.query(models.GuestbookMessage)
        .order_by(models.GuestbookMessage.created_at.desc(), models.GuestbookMessage.id.desc())
        .limit(limit)
        .all()
    )


@app.post("/api/guestbook", response_model=schemas.GuestbookMessageOut, status_code=201)
def create_guestbook_message(payload: schemas.GuestbookMessageCreate, db: Session = Depends(get_db)):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    mark = payload.mark if payload.mark in schemas.GUESTBOOK_MARKS else schemas.GUESTBOOK_MARKS[0]

    entry = models.GuestbookMessage(
        name=payload.name.strip()[:40],
        message=message,
        mark=mark,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@app.delete("/api/guestbook/{message_id}", status_code=204)
def delete_guestbook_message(
    message_id: int,
    db: Session = Depends(get_db),
    _admin: str = Depends(require_admin),
):
    entry = db.get(models.GuestbookMessage, message_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(entry)
    db.commit()
    return None


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Static frontend (Menu/) — kept under /menu so the domain root ("/") stays
# free for other sites/apps hosted on the same server later. All the assets
# (style.css, script.js, ledger.html, admin.html, ...) live under /menu/,
# and this one extra route gives the customer-facing page a clean top-level
# URL at /menu.html without moving/duplicating any files.
# ---------------------------------------------------------------------------


@app.get("/menu.html", include_in_schema=False)
def menu_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


# Password-gated: this explicit route intercepts /menu/admin.html before the
# StaticFiles mount below would otherwise serve it to anyone.
@app.get("/menu/admin.html", include_in_schema=False)
def admin_page(_admin: str = Depends(require_admin)):
    return FileResponse(os.path.join(FRONTEND_DIR, "admin.html"))


# Mounted last so /api/*, /menu.html and /menu/admin.html above take priority.
app.mount("/menu", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
