using backend.Data;
using backend.DTOs; // This fixes CS0246
using backend.Models;
using backend.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetIncomes()
        {
            return await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.INCOME)
                .Include(t => t.Category)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> PostIncome([FromBody] AddTransactionDto dto)
        {
            var transaction = new Transaction
            {
                Name = dto.Name,
                Amount = dto.Amount,
                Type = TransactionTypeEnum.INCOME,
                CategoryId = dto.CategoryId,
                Source = dto.Source,
                Method = dto.Method,
                Date = dto.Date
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(transaction);
        }
    }
}
