from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.user import User
from ..models.wardrobe_item import WardrobeItem
from ..schemas.wardrobe import WardrobeItemCreate, WardrobeItemUpdate, WardrobeItemResponse
from ..utils.dependencies import get_current_user
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/wardrobe", tags=["Wardrobe"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads/wardrobe"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/items", response_model=WardrobeItemResponse, status_code=status.HTTP_201_CREATED)
def create_wardrobe_item(
    item_data: WardrobeItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new clothing item to wardrobe"""
    
    new_item = WardrobeItem(
        user_id=current_user.id,
        **item_data.dict()
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    return new_item

@router.get("/items", response_model=List[WardrobeItemResponse])
def get_all_wardrobe_items(
    category: Optional[str] = None,
    season: Optional[str] = None,
    occasion: Optional[str] = None,
    favorite: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all wardrobe items for current user with optional filters"""
    
    query = db.query(WardrobeItem).filter(
        WardrobeItem.user_id == current_user.id,
        WardrobeItem.is_active == True
    )
    
    # Apply filters
    if category:
        query = query.filter(WardrobeItem.category == category)
    if season:
        query = query.filter(WardrobeItem.season == season)
    if occasion:
        query = query.filter(WardrobeItem.occasion == occasion)
    if favorite is not None:
        query = query.filter(WardrobeItem.favorite == favorite)
    
    items = query.all()
    return items

@router.get("/items/{item_id}", response_model=WardrobeItemResponse)
def get_wardrobe_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific wardrobe item by ID"""
    
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found"
        )
    
    return item

@router.put("/items/{item_id}", response_model=WardrobeItemResponse)
def update_wardrobe_item(
    item_id: int,
    item_data: WardrobeItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a wardrobe item"""
    
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found"
        )
    
    # Update only provided fields
    update_data = item_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    
    return item

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_wardrobe_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete (mark as inactive) a wardrobe item"""
    
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found"
        )
    
    # Soft delete
    item.is_active = False
    db.commit()
    
    return None

@router.post("/items/{item_id}/wear")
def mark_item_worn(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark an item as worn (increment wear count)"""
    
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found"
        )
    
    item.times_worn += 1
    item.last_worn = datetime.utcnow()
    db.commit()
    
    return {"message": "Item marked as worn", "times_worn": item.times_worn}

@router.post("/items/{item_id}/favorite")
def toggle_favorite(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle favorite status of an item"""
    
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wardrobe item not found"
        )
    
    item.favorite = not item.favorite
    db.commit()
    
    return {"message": "Favorite status updated", "favorite": item.favorite}

@router.get("/stats")
def get_wardrobe_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get wardrobe statistics for current user"""
    
    items = db.query(WardrobeItem).filter(
        WardrobeItem.user_id == current_user.id,
        WardrobeItem.is_active == True
    ).all()
    
    total_items = len(items)
    by_category = {}
    by_season = {}
    favorites = 0
    total_wears = 0
    
    for item in items:
        # Count by category
        by_category[item.category] = by_category.get(item.category, 0) + 1
        
        # Count by season
        if item.season:
            by_season[item.season] = by_season.get(item.season, 0) + 1
        
        # Count favorites
        if item.favorite:
            favorites += 1
        
        # Total wears
        total_wears += item.times_worn
    
    return {
        "total_items": total_items,
        "by_category": by_category,
        "by_season": by_season,
        "favorites": favorites,
        "total_wears": total_wears
    }