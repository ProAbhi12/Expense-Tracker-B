using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Models.Enums;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IncomeController(ApplicationDbContext context)
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
                .AnyAsync(c => c.Id == dto.Id);

            if (!categoryExists)
                return BadRequest("Invalid category");

            var transaction = new Transaction
            {
                Name = dto.Name,
                Amount = dto.Amount,
                Method = (TransactionMethod)dto.Method,
                Date = dto.Date,
                Id = dto.Id,
                Source = dto.Source,
                Type = TransactionTypeEnum.INCOME
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
                    categoryId = transaction.Id,
                    name = transaction.Category?.Name ?? "Unknown" 
                }
            });
        }


        [HttpGet]
        public async Task<IActionResult> GetAllIncome()
        {
            var incomes = await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.INCOME)
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
                        categoryId = t.Id,
                        name = t.Category.Name
                    }
                })
                .ToListAsync();

            return Ok(incomes);
        }


    }
}