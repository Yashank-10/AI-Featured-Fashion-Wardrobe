from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Float
from sqlalchemy.sql import func
from ..database import Base

class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # What was recommended
    recommendation_type = Column(String(50), nullable=False)  # "outfit", "shopping", "discard"
    recommendation_id = Column(Integer, nullable=False)  # ID of the recommended item/outfit
    
    # Feedback
    helpful = Column(Boolean, nullable=False)  # True = thumbs up, False = thumbs down
    rating = Column(Float, nullable=True)  # Optional 1-5 rating
    comment = Column(Text, nullable=True)  # Optional text feedback
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Feedback(id={self.id}, type={self.recommendation_type}, helpful={self.helpful})>"