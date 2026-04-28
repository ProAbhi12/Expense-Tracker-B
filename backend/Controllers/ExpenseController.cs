using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Models.Enums;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExpenseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddIncome([FromBody] AddTransactionDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid data");

            if (dto.Amount <= 0)
                return BadRequest("Amount must be greater than 0");

            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId);

            if (!categoryExists)
                return BadRequest("Invalid category");

            var transaction = new Transaction
            {
                Name = dto.Name,
                Amount = dto.Amount,
                Method = (TransactionMethod)dto.Method,
                Date = dto.Date,
                CategoryId = dto.CategoryId,  
                Source = dto.Source,
                Type = TransactionTypeEnum.EXPENSE
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            await _context.Entry(transaction)
                .Reference(t => t.Category)
                .LoadAsync();

            return Ok(new
            {
                transactionId = transaction.TransactionId,
                name = transaction.Name,
                type = transaction.Type.ToString(),
                amount = transaction.Amount,
                method = (int)transaction.Method,
                source = transaction.Source,
                date = transaction.Date,
                category = new
                {
                    categoryId = transaction.TransactionId,
                    name = transaction.Category?.Name ?? "Unknown"
                }
            });
        }


        [HttpGet]
        public async Task<IActionResult> GetAllIncome()
        {
            var expenses = await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.EXPENSE)
                .Include(t => t.Category)
                .OrderByDescending(t => t.Date)
                .Select(t => new
                {
                    transactionId = t.TransactionId,
                    name = t.Name,
                    type = t.Type.ToString(),
                    amount = t.Amount,
                    method = (int)t.Method,

                    date = t.Date,
                    category = t.Category == null ? null : new
                    {
                        categoryId = t.TransactionId,
                        name = t.Category.Name
                    }
                })
                .ToListAsync();

            return Ok(expenses);
        }


    }
}