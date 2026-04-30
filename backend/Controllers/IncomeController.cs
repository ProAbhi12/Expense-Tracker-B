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

        // --- NEW: DYNAMIC PUT (EDIT) ---
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncome(int id, [FromBody] AddTransactionDto dto)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();

            transaction.Name = dto.Name;
            transaction.Amount = dto.Amount;
            transaction.CategoryId = dto.CategoryId;
            transaction.Source = dto.Source;
            transaction.Method = dto.Method;
            transaction.Date = dto.Date;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // --- NEW: DYNAMIC DELETE ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncome(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null) return NotFound();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
