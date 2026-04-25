using backend.Data;
using backend.DTOs;
using backend.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;
        public DashboardController(ApplicationDbContext context) 
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary([FromQuery] DateRangeParameters filter)
        {
            var transactions = await _context.Transactions
                .Where(t => t.Date >= filter.FromDate && t.Date <= filter.ToDate)
                .ToListAsync();

            var totalIncome = transactions
                .Where(t => t.Type == TransactionTypeEnum.INCOME)
                .Sum(t => t.Amount);

            var totalExpense = transactions
                .Where(t => t.Type == TransactionTypeEnum.EXPENSE)
                .Sum(t => t.Amount);

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
