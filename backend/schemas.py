"""Pydantic request/response models."""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


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
