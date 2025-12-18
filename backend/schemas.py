"""
schemas.py - Pydantic Schemas
Request/Response models for API validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ============================================
# USER SCHEMAS
# ============================================

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=4, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    budget_limit: Optional[float] = Field(None, gt=0)


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    budget_limit: float
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============================================
# TASK SCHEMAS
# ============================================

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")  # YYYY-MM-DD format
    priority: str = Field(default="medium", pattern=r"^(low|medium|high)$")


class TaskCreate(TaskBase):
    """Schema for creating a task"""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    priority: Optional[str] = Field(None, pattern=r"^(low|medium|high)$")
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    """Schema for task response"""
    id: int
    user_id: int
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# EXPENSE SCHEMAS
# ============================================

class ExpenseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    category: str = Field(default="General", max_length=50)


class ExpenseCreate(ExpenseBase):
    """Schema for creating an expense"""
    date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")


class ExpenseResponse(ExpenseBase):
    """Schema for expense response"""
    id: int
    user_id: int
    date: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# BUDGET SUMMARY SCHEMA
# ============================================

class BudgetSummary(BaseModel):
    """Schema for budget summary"""
    budget_limit: float
    total_expenses: float
    remaining_budget: float
    expense_count: int
