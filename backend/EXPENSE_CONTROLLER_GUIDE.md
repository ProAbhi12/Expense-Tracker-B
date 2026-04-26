# ExpenseController - Frontend Integration Guide

## Overview
The ExpenseController is fully optimized for seamless frontend integration with clean DTOs and comprehensive error handling.

## Key Features

### 1. **DTO Mapping**
- Uses `ExpenseDto` for all responses
- Includes category information (Name, Color, Icon) for frontend display
- Converts enum values to strings for easy frontend consumption

```csharp
public class ExpenseDto
{
    public int TransactionId { get; set; }
    public string Name { get; set; }
    public decimal Amount { get; set; }
    public string? Source { get; set; }
    public string Method { get; set; }
    public DateTime Date { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string? CategoryColor { get; set; }
    public string? CategoryIcon { get; set; }
}
```

### 2. **Comprehensive Error Handling**
- Try-catch blocks on all endpoints
- Structured error responses for frontend error handling
- Proper HTTP status codes (200, 201, 400, 404, 500)
- Logging for debugging

### 3. **CRUD Operations**

#### CREATE - Add New Expense
```
POST /api/expense/create
Body:
{
    "name": "Grocery Shopping",
    "type": 1,  // 1 = EXPENSE
    "amount": 50.00,
    "source": "Big Mart",
    "method": 0,  // 0 = Cash, 1 = Card, etc.
    "date": "2026-01-01T10:00:00Z",
    "categoryId": 1
}

Response: 201 Created
{
    "transactionId": 1,
    "name": "Grocery Shopping",
    "amount": 50.00,
    "source": "Big Mart",
    "method": "Cash",
    "date": "2026-01-01T10:00:00Z",
    "categoryId": 1,
    "categoryName": "Food & Drinks",
    "categoryColor": "#ef4444",
    "categoryIcon": null
}
```

#### READ - Get All Expenses
```
GET /api/expense/all?categoryId=1&searchTerm=grocery

Response: 200 OK
[
    {
        "transactionId": 1,
        "name": "Grocery Shopping",
        ...
    }
]
```

#### READ - Get Single Expense
```
GET /api/expense/{id}

Response: 200 OK
{
    "transactionId": 1,
    ...
}
```

#### READ - Get Expenses by Date Range
```
POST /api/expense/by-date-range
Body:
{
    "fromDate": "2026-01-01T00:00:00Z",
    "toDate": "2026-01-31T23:59:59Z",
    "searchTerm": null
}

Response: 200 OK
[
    { ... },
    { ... }
]
```

#### UPDATE - Modify Expense
```
PUT /api/expense/update/{id}
Body:
{
    "name": "Updated Grocery Shopping",
    "type": 1,
    "amount": 60.00,
    "source": "Super Mart",
    "method": 1,
    "date": "2026-01-01T10:00:00Z",
    "categoryId": 1
}

Response: 200 OK
{
    "transactionId": 1,
    ...
}
```

#### DELETE - Remove Expense
```
DELETE /api/expense/delete/{id}

Response: 200 OK
{
    "message": "Expense deleted successfully"
}
```

### 4. **Analytics Endpoints**

#### Get Expenses by Category (Pie Chart)
```
POST /api/expense/by-category
Body:
{
    "fromDate": "2026-01-01T00:00:00Z",
    "toDate": "2026-01-31T23:59:59Z"
}

Response: 200 OK
[
    {
        "categoryName": "Food & Drinks",
        "amount": 500.00,
        "color": "#ef4444",
        "percentage": 60.5
    },
    {
        "categoryName": "Utilities",
        "amount": 300.00,
        "color": "#06b6d4",
        "percentage": 36.2
    }
]
```

#### Get Total Expenses
```
POST /api/expense/total
Body:
{
    "fromDate": "2026-01-01T00:00:00Z",
    "toDate": "2026-01-31T23:59:59Z"
}

Response: 200 OK
827.50
```

#### Get Expenses by Payment Method
```
POST /api/expense/by-method
Body:
{
    "fromDate": "2026-01-01T00:00:00Z",
    "toDate": "2026-01-31T23:59:59Z"
}

Response: 200 OK
[
    {
        "method": "Cash",
        "amount": 500.00,
        "count": 10
    },
    {
        "method": "Card",
        "amount": 327.50,
        "count": 5
    }
]
```

#### Get Monthly Expense Trend
```
POST /api/expense/monthly-trend
Body:
{
    "fromDate": "2025-11-01T00:00:00Z",
    "toDate": "2026-01-31T23:59:59Z"
}

Response: 200 OK
[
    {
        "date": "2025-11-01T00:00:00Z",
        "amount": 800.00
    },
    {
        "date": "2025-12-01T00:00:00Z",
        "amount": 950.00
    },
    {
        "date": "2026-01-01T00:00:00Z",
        "amount": 827.50
    }
]
```

## Frontend Integration Tips

### 1. **Error Handling**
```javascript
try {
    const response = await fetch('http://api/expense/all');
    if (!response.ok) {
        const error = await response.json();
        console.error(error.error);
    }
} catch (error) {
    console.error('Network error:', error);
}
```

### 2. **Loading States**
All endpoints are async and should have loading indicators in the UI.

### 3. **Category Filtering**
Use the returned `categoryColor` and `categoryIcon` for better UI/UX:
```javascript
expenses.map(expense => (
    <ExpenseItem
        key={expense.transactionId}
        name={expense.name}
        amount={expense.amount}
        categoryName={expense.categoryName}
        categoryColor={expense.categoryColor}
        categoryIcon={expense.categoryIcon}
    />
))
```

### 4. **Date Formatting**
JavaScript dates from API come in ISO 8601 format. Format as needed:
```javascript
new Date(expense.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
})
```

## Validation Rules

### On Create/Update:
- ✅ Type must be EXPENSE (1)
- ✅ Category must exist and be EXPENSE type
- ✅ Amount must be > 0
- ✅ Date must be valid
- ✅ Name cannot be empty
- ✅ Method must be valid enum value

### Date Range Queries:
- ✅ FromDate must be <= ToDate
- ✅ Both dates are inclusive

## Security Considerations

- ✅ All endpoints filter for EXPENSE type only (no income/budget data leakage)
- ✅ Category type validation prevents wrong category assignments
- ✅ Proper HTTP status codes prevent information leakage
- ✅ Logging without exposing sensitive data

## Performance Notes

- Includes category data in single query (using Include)
- Async/await for non-blocking operations
- Grouped queries for analytics (pie chart, method breakdown)
- Index on Type and Date fields recommended for large datasets

## Ready for Production! ✅
