from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.user import User
from ..models.wardrobe_item import WardrobeItem
from ..models.feedback import RecommendationFeedback
from ..utils.dependencies import get_current_user
from ..services.outfit_recommender import recommend_outfits, calculate_body_shape_score, calculate_undertone_score
from ..services.color_harmony import score_outfit_colors
from ..schemas.recommendation import RecommendationsResponse, RecommendedOutfit, OutfitItemDisplay, FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/outfits", response_model=RecommendationsResponse)
def get_outfit_recommendations(
    occasion: Optional[str] = None,
    season: Optional[str] = None,
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate outfit recommendations based on user's wardrobe and profile
    Uses rule-based scoring algorithm with color harmony, body shape, and undertone matching
    """
    
    # Get user's wardrobe items
    query = db.query(WardrobeItem).filter(
        WardrobeItem.user_id == current_user.id,
        WardrobeItem.is_active == True
    )
    
    # Apply filters if provided
    if occasion:
        query = query.filter(WardrobeItem.occasion == occasion)
    if season:
        query = query.filter(WardrobeItem.season == season)
    
    wardrobe_items = query.all()
    
    if len(wardrobe_items) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough wardrobe items to generate recommendations. Add at least 2 items."
        )
    
    # Convert SQLAlchemy models to dictionaries
    items_dict = []
    for item in wardrobe_items:
        items_dict.append({
            "id": item.id,
            "category": item.category,
            "subcategory": item.subcategory,
            "color_primary": item.color_primary,
            "color_secondary": item.color_secondary,
            "pattern": item.pattern,
            "season": item.season,
            "occasion": item.occasion
        })
    
    # User profile for personalization
    user_profile = {
        "body_shape": current_user.body_shape or "rectangle",
        "undertone": current_user.undertone or "neutral",
        "style_preference": current_user.style_preferences
    }
    
    # Generate recommendations using rule-based algorithm
    recommendations = recommend_outfits(
        wardrobe_items=items_dict,
        user_profile=user_profile,
        top_k=limit
    )
    
    # Format response with detailed scoring
    formatted_recommendations = []
    for rec in recommendations:
        outfit_items_list = []
        outfit_items_data = []
        
        for item_id in rec["item_ids"]:
            item = next((i for i in wardrobe_items if i.id == item_id), None)
            if item:
                outfit_items_list.append(item)
                outfit_items_data.append(OutfitItemDisplay(
                    id=item.id,
                    category=item.category,
                    color_primary=item.color_primary,
                    image_path=item.image_path,
                    subcategory=item.subcategory
                ))
        
        # Calculate individual scores
        color_harmony = score_outfit_colors([
            {"color_primary": item.color_primary} for item in outfit_items_list
        ])
        body_shape_score = calculate_body_shape_score(
            [item.__dict__ for item in outfit_items_list],
            user_profile.get("body_shape", "rectangle")
        )
        undertone_score = calculate_undertone_score(
            [item.__dict__ for item in outfit_items_list],
            user_profile.get("undertone", "neutral")
        )
        
        recommended_outfit = RecommendedOutfit(
            recommendation_id=rec["item_ids"][0],
            item_ids=rec["item_ids"],
            items=outfit_items_data,
            color_harmony_score=round(color_harmony * 100),
            body_shape_score=round(body_shape_score * 100),
            undertone_score=round(undertone_score * 100),
            overall_score=round(rec["score"] * 100),
            occasion="Everyday"
        )
        formatted_recommendations.append(recommended_outfit)
    
    return RecommendationsResponse(
        total_recommendations=len(formatted_recommendations),
        recommendations=formatted_recommendations
    )

@router.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit feedback on a recommendation (rating, helpful/unhelpful, comments)
    """
    
    # Create feedback record
    new_feedback = RecommendationFeedback(
        user_id=current_user.id,
        recommendation_id=feedback_data.recommendation_id,
        recommendation_type=feedback_data.recommendation_type or "outfit",
        helpful=feedback_data.helpful,
        rating=feedback_data.rating,
        comment=feedback_data.comment
    )
    
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return new_feedback

@router.get("/feedback", response_model=List[FeedbackResponse])
def get_my_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all feedback submitted by current user
    """
    feedback_records = db.query(RecommendationFeedback).filter(
        RecommendationFeedback.user_id == current_user.id
    ).order_by(RecommendationFeedback.created_at.desc()).all()
    
    return feedback_records
