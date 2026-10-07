from fastapi import APIRouter, status, HTTPException, Depends, Response, Cookie
from sqlalchemy import select
from app.models.user import User
from app.core.database import get_db
from app.core.config import settings
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.schemas.auth import (
    UserResponse,
    RegisterRequest,
    LoginRequest,
    TokenResponse
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)
from uuid import UUID


router = APIRouter(
    prefix='/auth',
    tags=["Authentication"],
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    request: RegisterRequest,
    db:Session = Depends(get_db)
):
    email = request.email.lower() 
    
    existing_user = db.scalar(
        select(User).where(User.email == email)
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
        
    user = User(
        name=request.name,
        email=email,
        hashed_password=hash_password(request.password),
        team=request.team
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user
    

@router.post("/login", response_model=TokenResponse)
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    email = request.email.lower()
    
    user = db.scalar(
        select(User).where(User.email == email)
    )
    
    if not user or not verify_password(
        request.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
        
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
    )
    return TokenResponse(
        access_token=access_token,
    )
    
@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user
    
@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_token(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    # print(refresh_token)
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )

    try:

        payload = decode_token(refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        user = db.get(User, UUID(user_id))

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        new_access_token = create_access_token(str(user.id))

        return TokenResponse(
            access_token=new_access_token,
        )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
        
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token")

    return {
        "message": "Logged out successfully"
    }