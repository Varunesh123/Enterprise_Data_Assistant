import uuid
from datetime import datetime

from sqlalchemy import DateTime, func, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

class Schema(Base):
    __tablename__ = "schemas"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    catalog_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("catalogs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,      
    )
    name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )
    display_name: Mapped[str | None] = mapped_column(
        String(180),
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    environment: Mapped[str]= mapped_column(
        String(50),
        default="development",
        nullable=False,
    )
    owner_team: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    
    catalog = relationship(
        "Catalog",
        back_populates="schemas",
    )