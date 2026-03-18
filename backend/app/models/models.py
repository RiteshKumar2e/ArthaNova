from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    persona = Column(String, default="investor")
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    summary = Column(Text)
    category = Column(String)
    source = Column(String)
    sentiment_score = Column(Float)
    impact_score = Column(String)
    # persona_tags: investor, founder, student, etc. (CSV or JSON)
    persona_tags = Column(String, default="investor")
    published_at = Column(DateTime, default=datetime.datetime.utcnow)
    metadata_json = Column(JSON, default={})

class Briefing(Base):
    __tablename__ = "briefings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    key_points = Column(JSON)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StoryArc(Base):
    __tablename__ = "story_arcs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    key_players = Column(JSON) # List of Entities
    status = Column(String, default="Developing")
    prediction = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    events = relationship("StoryEvent", back_populates="arc")

class StoryEvent(Base):
    __tablename__ = "story_events"
    id = Column(Integer, primary_key=True, index=True)
    arc_id = Column(Integer, ForeignKey("story_arcs.id"))
    title = Column(String)
    description = Column(Text)
    sentiment = Column(Float)
    event_date = Column(DateTime)
    
    arc = relationship("StoryArc", back_populates="events")
