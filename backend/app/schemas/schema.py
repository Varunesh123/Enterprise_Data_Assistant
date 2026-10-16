from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

class SchemaCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    display_name: str | None = Field(default=None, max_length=180)
    description: str | None = None
    environment: str = Field(default="development", max_length=50)
    owner_team: str | None = Field(default=None, max_length=120)
    
class SchemaResponse(BaseModel):
    id: UUID
    catalog_id: UUID
    name: str
    display_name: str | None
    description: str | None
    environment: str
    owner_team: str | None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)