from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Wardrobe Item Schemas
class WardrobeItemCreate(BaseModel):
    category: str
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    color_primary: str
    color_secondary: Optional[str] = None
    pattern: Optional[str] = None
    material: Optional[str] = None
    image_path: str = ""
    season: Optional[str] = None
    occasion: Optional[str] = None

class WardrobeItemUpdate(BaseModel):
    category: Optional[str] = None
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    color_primary: Optional[str] = None
    color_secondary: Optional[str] = None
    pattern: Optional[str] = None
    material: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    favorite: Optional[bool] = None

class WardrobeItemResponse(BaseModel):
    id: int
    user_id: int
    category: str
    subcategory: Optional[str]
    brand: Optional[str]
    color_primary: str
    color_secondary: Optional[str]
    pattern: Optional[str]
    material: Optional[str]
    image_path: str
    season: Optional[str]
    occasion: Optional[str]
    times_worn: int
    last_worn: Optional[datetime]
    favorite: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Outfit Schemas
class OutfitCreate(BaseModel):
    name: Optional[str] = None
    occasion: Optional[str] = None
    season: Optional[str] = None
    item_ids: str  # Comma-separated IDs

class OutfitResponse(BaseModel):
    id: int
    user_id: int
    name: Optional[str]
    occasion: Optional[str]
    season: Optional[str]
    item_ids: str
    rating: Optional[float]
    notes: Optional[str]
    times_worn: int
    last_worn: Optional[datetime]
    favorite: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Feedback Schemas
class FeedbackCreate(BaseModel):
    recommendation_type: str
    recommendation_id: int
    helpful: bool
    rating: Optional[float] = None
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    recommendation_type: str
    recommendation_id: int
    helpful: bool
    rating: Optional[float]
    comment: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
