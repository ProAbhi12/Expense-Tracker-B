using backend.Data;
using backend.DTOs;
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
    }
}
