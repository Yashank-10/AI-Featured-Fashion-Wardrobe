from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..config import settings
from ..models.user import User
from ..models.wardrobe_item import WardrobeItem
from ..schemas.wardrobe import WardrobeItemResponse
from ..utils.dependencies import get_current_user
import os
import uuid
from PIL import Image
import io

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "uploads/wardrobe"
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_IMAGE_FORMATS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "WEBP": ".webp",
}

@router.post("/wardrobe-item", response_model=WardrobeItemResponse, status_code=status.HTTP_201_CREATED)
async def upload_wardrobe_item(
    file: UploadFile = File(...),
    category: str = Form("shirt"),
    color_primary: str = Form("blue"),
    subcategory: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    pattern: Optional[str] = Form("solid"),
    material: Optional[str] = Form(None),
    season: Optional[str] = Form(None),
    occasion: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a wardrobe item with image"""
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )

    # Read and save image
    contents = await file.read()

    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image exceeds the {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB upload limit"
        )

    # Optional: Resize image to save space
    try:
        image = Image.open(io.BytesIO(contents))
        image_format = (image.format or "").upper()
        file_extension = ALLOWED_IMAGE_FORMATS.get(image_format)

        if not file_extension:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only JPEG, PNG, and WEBP images are supported"
            )

        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        public_image_path = f"/uploads/wardrobe/{unique_filename}"
        image.thumbnail((800, 800))  # Resize to max 800x800
        image.save(file_path, format=image_format)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing image: {str(e)}"
        )
    
    # Create wardrobe item
    new_item = WardrobeItem(
        user_id=current_user.id,
        category=category,
        subcategory=subcategory,
        brand=brand,
        color_primary=color_primary,
        pattern=pattern,
        material=material,
        image_path=public_image_path,
        season=season,
        occasion=occasion
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    return new_item
