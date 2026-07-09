"""Pydantic request/response models."""
from datetime import datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_serializer


# SQLite has no real timezone storage, so timestamps read back from the
# database (via SQLAlchemy's `server_default=func.now()`) come back as naive
# datetimes that are actually UTC under the hood. Serialized as-is, the JSON
# output has no "Z"/offset marker, and `new Date(...)` in the browser then
# (per the ECMAScript date-time string spec) treats the string as *local*
# time instead of UTC — silently shifting every displayed timestamp by the
# visitor's UTC offset. Stamping the offset here fixes that at the source.
def _as_utc_isoformat(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.isoformat()


class CocktailBase(BaseModel):
    name: str
    zh: str = ""
    base: str = "Other"
    collection: str = Field(default="classic", pattern="^(classic|signature)$")
    taste_note: str = ""
    price: int = 0
    ingredients: List[str] = []
    ledger_priority: Optional[int] = None


class CocktailCreate(CocktailBase):
    pass


class CocktailUpdate(CocktailBase):
    pass


class CocktailOut(CocktailBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class LedgerCatalogItem(BaseModel):
    id: Optional[int] = None
    name: str
    zh: str = ""
    base: str = "Other"
    price: int = 0
    is_off_menu: bool = False


class OrderItemIn(BaseModel):
    name: str
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    note: str = ""
    discount: int = 100
    items: List[OrderItemIn]


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    zh: str
    quantity: int
    unit_price: int
    subtotal: int


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    note: str
    discount: int
    cups: int
    subtotal: int
    total: int
    items: List[OrderItemOut]

    @field_serializer("created_at")
    def _serialize_created_at(self, value: datetime) -> str:
        return _as_utc_isoformat(value)


GUESTBOOK_MARKS = ("✦", "♥", "☾", "✎", "✧")


class GuestbookMessageCreate(BaseModel):
    name: str = Field(default="", max_length=40)
    message: str = Field(min_length=1, max_length=300)
    mark: str = "✦"


class GuestbookMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    name: str
    message: str
    mark: str

    @field_serializer("created_at")
    def _serialize_created_at(self, value: datetime) -> str:
        return _as_utc_isoformat(value)
