using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ExpenseController> _logger;

        public ExpenseController(ApplicationDbContext context, ILogger<ExpenseController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private ExpenseDto MapToDto(Transaction transaction)
        {
            return new ExpenseDto
            {
                TransactionId = transaction.TransactionId,
                Name = transaction.Name,
                Amount = transaction.Amount,
                Source = transaction.Source,
                Method = (int)transaction.Method,
                Date = transaction.Date,
                CategoryId = transaction.CategoryId
            };
        }

        /// <summary>
        /// Get all expenses
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<List<ExpenseDto>>> GetAllExpenses()
        {
            try
            {
                var expenses = await _context.Transactions
                    .Where(t => t.Type == TransactionTypeEnum.EXPENSE)
                    .Include(t => t.Category)
                    .OrderByDescending(t => t.Date)
                    .ToListAsync();

                var expenseDtos = expenses.Select(MapToDto).ToList();

                _logger.LogInformation($"Retrieved {expenseDtos.Count} expenses");
                return Ok(expenseDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving all expenses: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while retrieving expenses" });
            }
        }


        /// <summary>
        /// Create a new expense
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<ExpenseDto>> CreateExpense([FromBody] ExpenseDto expenseDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Create Transaction from DTO
                var expense = new Transaction
                {
                    Name = expenseDto.Name,
                    Amount = expenseDto.Amount,
                    Source = expenseDto.Source,
                    Method = (TransactionMethod)expenseDto.Method,
                    Date = expenseDto.Date,
                    Type = TransactionTypeEnum.EXPENSE,
                    CategoryId = expenseDto.CategoryId
                };

                // Verify category exists and is an expense category
                var category = await _context.Categories.FindAsync(expense.CategoryId);
                if (category == null)
                    return NotFound(new { error = "Category not found" });

                if (category.Type != TransactionTypeEnum.EXPENSE)
                    return BadRequest(new { error = "Category must be an EXPENSE category" });

                _context.Transactions.Add(expense);
                await _context.SaveChangesAsync();

                var responseDto = MapToDto(expense);

                _logger.LogInformation($"Created new expense with ID: {expense.TransactionId}");
                return CreatedAtAction(nameof(GetExpenseById), new { id = expense.TransactionId }, responseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating expense: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while creating the expense" });
            }
        }

        /// <summary>
        /// Get expense by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetExpenseById(int id)
        {
            try
            {
                var expense = await _context.Transactions
                    .Include(t => t.Category)
                    .FirstOrDefaultAsync(t => t.TransactionId == id && t.Type == TransactionTypeEnum.EXPENSE);

                if (expense == null)
                    return NotFound(new { error = "Expense not found" });

                var expenseDto = MapToDto(expense);
                return Ok(expenseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving expense {id}: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while retrieving the expense" });
            }
        }

        /// <summary>
        /// Update an expense
        /// </summary>
        [HttpPut("update/{id}")]
        public async Task<ActionResult<ExpenseDto>> UpdateExpense(int id, [FromBody] ExpenseDto updatedExpenseDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var expense = await _context.Transactions
                    .FirstOrDefaultAsync(t => t.TransactionId == id && t.Type == TransactionTypeEnum.EXPENSE);

                if (expense == null)
                    return NotFound(new { error = "Expense not found" });

                // Verify category exists if changed
                if (expense.CategoryId != updatedExpenseDto.CategoryId)
                {
                    var category = await _context.Categories.FindAsync(updatedExpenseDto.CategoryId);
                    if (category == null)
                        return NotFound(new { error = "Category not found" });

                    if (category.Type != TransactionTypeEnum.EXPENSE)
                        return BadRequest(new { error = "Category must be an EXPENSE category" });
                }

                expense.Name = updatedExpenseDto.Name;
                expense.Amount = updatedExpenseDto.Amount;
                expense.Source = updatedExpenseDto.Source;
                expense.Method = (TransactionMethod)updatedExpenseDto.Method;
                expense.Date = updatedExpenseDto.Date;
                expense.CategoryId = updatedExpenseDto.CategoryId;

                _context.Transactions.Update(expense);
                await _context.SaveChangesAsync();

                var expenseDto = MapToDto(expense);

                _logger.LogInformation($"Updated expense with ID: {id}");
                return Ok(expenseDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating expense {id}: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating the expense" });
            }
        }

        /// <summary>
        /// Delete an expense
        /// </summary>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
            {
                var expense = await _context.Transactions
                    .FirstOrDefaultAsync(t => t.TransactionId == id && t.Type == TransactionTypeEnum.EXPENSE);

                if (expense == null)
                    return NotFound(new { error = "Expense not found" });

                _context.Transactions.Remove(expense);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Deleted expense with ID: {id}");
                return Ok(new { message = "Expense deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting expense {id}: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while deleting the expense" });
            }
        }
    }
}
