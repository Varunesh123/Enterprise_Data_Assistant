from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.schema import SchemaResponse, SchemaCreate
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.catalog import Catalog
from app.models.schema import Schema
from app.models.user import User

router = APIRouter(
    prefix="/catalogs/{catalogId}/schemas",
    tags=["Schemas"],
)

@router.get("", response_model=list[SchemaResponse])
def list_schemas(
    catalogId: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("Inside Schema")
    catalog = db.scalar(select(Catalog).where(Catalog.id == catalogId))
    
    if not catalog:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail="Catalog not found",
        )
    
    schemas = db.scalars(
        select(Schema).where(Schema.catalog_id == catalogId).order_by(Schema.name)
    ).all()
    
    return schemas

@router.post(
    "", 
    response_model=SchemaResponse, 
    status_code=status.HTTP_201_CREATED
)
def create_schema(
    catalogId: UUID,
    payload: SchemaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    catalog = db.scalar(select(Catalog).where(Catalog.id == catalogId))
    print("Catalog", catalog)
    
    if not catalog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail= 'Catalog not found'
        )
    
    existing = db.scalar(
        select(Schema).where(
            Schema.catalog_id == catalogId,
            Schema.name == payload.name,
        )
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Schema already exist in this catalog",
        )
    
    schema = Schema(
        catalog_id=catalogId,
        name=payload.name,
        display_name=payload.display_name,
        description=payload.description,
        environment=payload.environment,
        owner_team=payload.owner_team,
    )
    db.add(schema)
    db.commit()
    db.refresh(schema)
    
    return schema

@router.get("/{schema_id}", response_model=SchemaResponse)
def get_schema(
    catalogId: UUID,
    schema_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
): 
    schema = db.scalar(
        select(Schema).where(
            Schema.catalog_id == catalogId,
            Schema.id == schema_id
        )
    )
    
    if not schema:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schema not found"
        )

    return schema
        
        