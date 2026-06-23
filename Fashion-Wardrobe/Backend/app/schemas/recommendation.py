from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OutfitItemDisplay(BaseModel):
    id: int
    category: str
    color_primary: str
    image_path: str
    subcategory: Optional[str] = None

class RecommendedOutfit(BaseModel):
    recommendation_id: int
    item_ids: List[int]
    items: List[OutfitItemDisplay]
    color_harmony_score: float
    body_shape_score: float
    undertone_score: float
    overall_score: float
    occasion: str = "Everyday"

class RecommendationsResponse(BaseModel):
    total_recommendations: int
    recommendations: List[RecommendedOutfit]

class FeedbackCreate(BaseModel):
    recommendation_type: Optional[str] = "outfit"
    recommendation_id: int
    rating: Optional[int] = None  # 1-5 stars
    helpful: Optional[bool] = None  # True/False for helpful/unhelpful
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    recommendation_type: str
    recommendation_id: int
    rating: Optional[int]
    helpful: Optional[bool]
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
