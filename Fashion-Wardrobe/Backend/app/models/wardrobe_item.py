from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Item Details
    category = Column(String, nullable=False)  # e.g., "shirt", "pants", "dress", "shoes"
    subcategory = Column(String, nullable=True)  # e.g., "t-shirt", "jeans", "sneakers"
    brand = Column(String, nullable=True)
    color_primary = Column(String, nullable=False)  # e.g., "blue", "red"
    color_secondary = Column(String, nullable=True)  # e.g., "white" (for patterns)
    pattern = Column(String, nullable=True)  # e.g., "solid", "striped", "floral"
    material = Column(String, nullable=True)  # e.g., "cotton", "denim", "leather"
    
    # Image Storage
    image_path = Column(String, nullable=False)  # Path to stored image
    
    # Metadata
    season = Column(String, nullable=True)  # e.g., "summer", "winter", "all-season"
    occasion = Column(String, nullable=True)  # e.g., "casual", "formal", "sports"
    
    # Usage Tracking
    times_worn = Column(Integer, default=0)
    last_worn = Column(DateTime(timezone=True), nullable=True)
    favorite = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)  # False if discarded
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    # user = relationship("User", back_populates="wardrobe_items")
    
    def __repr__(self):
        return f"<WardrobeItem(id={self.id}, category={self.category}, color={self.color_primary})>"