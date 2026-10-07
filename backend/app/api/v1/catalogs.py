from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User
from app.api.dependencies import get_current_user
from app.schemas.catalog import (
    CatalogResponse,
    CatalogCreate
)
from app.models.catalog import Catalog

router = APIRouter(
    prefix="/catalogs",
    tags=["Catalogs"]
)

@router.get(
    "",
    response_model=list[CatalogResponse]
)
def list_catalogs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    statement = (
        select(Catalog).order_by(Catalog.created_at.desc())
    )
    return list(db.scalars(statement).all())

@router.post(
    "",
    response_model=CatalogResponse,
    status_code=status.HTTP_201_CREATED
)
def create_catalog(
    request: CatalogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(request)
    existing = db.scalar(
        select(Catalog).where(Catalog.name == request.name)
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Catalog already exists",
        )
        
    catalog = Catalog(
        name=request.name,
        display_name=request.display_name,
        description=request.description,
        environment=request.environment,
        owner_team=request.owner_team,
    )
    db.add(catalog)
    db.commit()
    db.refresh(catalog)
    
    return catalog

@router.get(
    "/{catalog_id}",
    response_model=CatalogResponse,
)
def get_catalog(
    catalog_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    catalog = db.get(Catalog, catalog_id)
    
    if not catalog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Catalog not found"
        )
    return catalog
