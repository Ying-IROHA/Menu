"""ORM models: cocktails (the menu) and orders (the ledger)."""
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from database import Base


class Cocktail(Base):
    __tablename__ = "cocktails"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    zh = Column(String, nullable=False, default="")
    base = Column(String, nullable=False, default="Other")
    collection = Column(String, nullable=False, default="classic")  # "classic" | "signature"
    taste_note = Column(String, nullable=False, default="")
    price = Column(Integer, nullable=False, default=0)
    ingredients = Column(JSON, nullable=False, default=list)
    # Lower number = shown closer to the top of the private ledger's quick-order
    # list. Null means "no pin", sorted alphabetically after pinned items.
    ledger_priority = Column(Integer, nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    note = Column(String, nullable=False, default="")
    discount = Column(Integer, nullable=False, default=100)
    cups = Column(Integer, nullable=False, default=0)
    subtotal = Column(Integer, nullable=False, default=0)
    total = Column(Integer, nullable=False, default=0)

    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    name = Column(String, nullable=False)
    zh = Column(String, nullable=False, default="")
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Integer, nullable=False, default=0)
    subtotal = Column(Integer, nullable=False, default=0)

    order = relationship("Order", back_populates="items")
