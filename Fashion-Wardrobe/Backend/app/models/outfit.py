from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Float
from sqlalchemy.sql import func
from ..database import Base

class Outfit(Base):
    __tablename__ = "outfits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Outfit Details
    name = Column(String, nullable=True)  # User-given name
    occasion = Column(String, nullable=True)  # e.g., "work", "date", "gym"
    season = Column(String, nullable=True)
    
    # Items in this outfit (stored as comma-separated IDs)
    item_ids = Column(Text, nullable=False)  # e.g., "1,5,12,23"
    
    # Rating & Feedback
    rating = Column(Float, nullable=True)  # 1-5 stars
    notes = Column(Text, nullable=True)  # User notes
    
    # Usage
    times_worn = Column(Integer, default=0)
    last_worn = Column(DateTime(timezone=True), nullable=True)
    favorite = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Outfit(id={self.id}, name={self.name})>"