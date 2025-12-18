"""
routers/users.py - User and Authentication Endpoints
Handles registration, login, and profile management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()


# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

@router.post("/auth/register", response_model=schemas.Token)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - Checks if email already exists
    - Hashes password
    - Creates user and returns JWT token
    """
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token - sub must be string
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }


@router.post("/auth/login", response_model=schemas.Token)
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password
    
    - Validates credentials
    - Returns JWT token
    """
    # Find user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token - sub must be string
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


# ============================================
# USER PROFILE ENDPOINTS
# ============================================

@router.get("/users/me", response_model=schemas.UserResponse)
async def get_current_user_profile(current_user: models.User = Depends(get_current_user)):
    """Get the current user's profile"""
    return current_user


@router.put("/users/me", response_model=schemas.UserResponse)
async def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's profile"""
    
    # Check if email is being changed to an existing email
    if user_update.email and user_update.email != current_user.email:
        existing = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        current_user.email = user_update.email
    
    # Update other fields if provided
    if user_update.name:
        current_user.name = user_update.name
    
    if user_update.budget_limit is not None:
        current_user.budget_limit = user_update.budget_limit
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.get("/users/me/budget", response_model=schemas.BudgetSummary)
async def get_budget_summary(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the current user's budget summary"""
    
    # Calculate total expenses
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()
    total_expenses = sum(expense.amount for expense in expenses)
    
    return {
        "budget_limit": current_user.budget_limit,
        "total_expenses": total_expenses,
        "remaining_budget": current_user.budget_limit - total_expenses,
        "expense_count": len(expenses)
    }
