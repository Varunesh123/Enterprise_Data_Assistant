from pydantic import BaseModel, Field,ConfigDict
from datetime import datetime
from uuid import UUID

class CatalogCreate(BaseModel):
    name: str = Field(
        min_length = 2,
        max_length = 120,
    )
    display_name: str = Field(
        min_length=2,
        max_length=160,
    )
    description: str | None = None
    
    environment: str = Field(
        default="development",
        max_length=50,
    )

    owner_team: str | None = Field(
        default=None,
        max_length=120,
    )


class CatalogResponse(BaseModel):
    id: UUID
    name: str
    display_name: str
    description: str | None
    environment: str
    owner_team: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
    