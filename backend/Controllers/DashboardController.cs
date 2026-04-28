using backend.Data;
using backend.DTOs;
using backend.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary([FromQuery] DateRangeParameters filter)
        {
            var query = _context.Transactions.AsQueryable();

            if (filter.FromDate.HasValue)
            {
                // If FromDate exists, keep only transactions AFTER that date
                query = query.Where(t => t.Date >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                // If ToDate exists, keep only transactions BEFORE that date
                query = query.Where(t => t.Date <= filter.ToDate.Value);
            }

            // Now we execute the "final" filtered list
            var transactions = await query.ToListAsync();

            var totalIncome = transactions.Where(t => t.Type == TransactionTypeEnum.INCOME).Sum(t => t.Amount);
            var totalExpense = transactions.Where(t => t.Type == TransactionTypeEnum.EXPENSE).Sum(t => t.Amount);

            var finalResult = new DashboardSummaryDTO
            {
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                TotalBalance = totalIncome - totalExpense,
                TransactionCount = transactions.Count
            };

            return Ok(finalResult);
        }
    }
}
