"""
routers/expenses.py - Expense CRUD Endpoints
Handles creating, reading, and deleting expenses
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("", response_model=List[schemas.ExpenseResponse])
async def get_all_expenses(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all expenses for the current user"""
    expenses = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).order_by(models.Expense.date.desc(), models.Expense.created_at.desc()).all()
    
    return expenses


@router.get("/summary", response_model=schemas.BudgetSummary)
async def get_expense_summary(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get expense summary with budget status"""
    expenses = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).all()
    
    total = sum(expense.amount for expense in expenses)
    
    return {
        "budget_limit": current_user.budget_limit,
        "total_expenses": total,
        "remaining_budget": current_user.budget_limit - total,
        "expense_count": len(expenses)
    }


@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
async def get_expense(
    expense_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific expense by ID"""
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    return expense


@router.post("", response_model=schemas.ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense: schemas.ExpenseCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new expense"""
    # Use today's date if not provided
    expense_date = expense.date if expense.date else date.today().isoformat()
    
    db_expense = models.Expense(
        user_id=current_user.id,
        name=expense.name,
        amount=expense.amount,
        category=expense.category,
        date=expense_date
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    return db_expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an expense"""
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    
    if not db_expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    db.delete(db_expense)
    db.commit()
    
    return None


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_expenses(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete all expenses for the current user"""
    db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).delete()
    
    db.commit()
    
    return None
