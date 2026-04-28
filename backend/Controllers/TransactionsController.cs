using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("alltransactions")]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .OrderByDescending(t => t.Date)
                .Select(t => new TransactionDto
                {
                    Id = t.TransactionId,
                    Name = t.Name,
                    Amount = t.Amount,
                    Type = t.Type.ToString(),
                    CategoryName = t.Category.Name,
                    CategoryColor = t.Category.Color ?? "#888888",
                    Source = t.Source ?? "",
                    Method = t.Method.ToString(),
                    Date = t.Date
                })
                .ToListAsync();

            return Ok(transactions);
        }

        // --- ADDED: POST method to save new transactions ---
        [HttpPost("add")]
        public async Task<IActionResult> AddTransaction([FromBody] AddTransactionDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Create a new database Model from the DTO
            var transaction = new Transaction
            {
                Name = dto.Name,
                Amount = dto.Amount,
                Type = dto.Type,
                CategoryId = dto.CategoryId,
                Source = dto.Source,
                Method = dto.Method,
                Date = dto.Date
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Transaction saved successfully", id = transaction.TransactionId });
        }
    }
}
