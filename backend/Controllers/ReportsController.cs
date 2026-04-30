using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;
using backend.Models.Enums;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Resolves nullable dates — defaults to all-time range if not provided
        private (DateTime from, DateTime to) ResolveDateRange(DateTime? fromDate, DateTime? toDate)
        {
            var from = fromDate?.Date ?? _context.Transactions
                .OrderBy(t => t.Date).Select(t => t.Date).FirstOrDefault().Date;
            var to = toDate?.Date ?? DateTime.Today;
            return (from == default ? DateTime.Today : from, to);
        }

        /// <summary>
        /// Pie chart data by category.
        /// Defaults to EXPENSE only (pass transactionType=INCOME to override).
        /// </summary>
        [HttpGet("pie-chart")]
        public async Task<ActionResult<IEnumerable<PieChartDataDTO>>> GetPieChartData(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] string transactionType = "EXPENSE")  // Default to EXPENSE
        {
            var (from, to) = ResolveDateRange(fromDate, toDate);
            if (from > to) return BadRequest("FromDate cannot be greater than ToDate");

            var query = _context.Transactions
                .Where(t => t.Date.Date >= from && t.Date.Date <= to);

            if (transactionType.Equals("INCOME", StringComparison.OrdinalIgnoreCase))
                query = query.Where(t => t.Type == TransactionTypeEnum.INCOME);
            else if (transactionType.Equals("EXPENSE", StringComparison.OrdinalIgnoreCase))
                query = query.Where(t => t.Type == TransactionTypeEnum.EXPENSE);

            var pieChartData = await query
                .GroupBy(t => new { t.CategoryId, t.Category.Name, t.Category.Color })
                .Select(g => new PieChartDataDTO
                {
                    CategoryName = g.Key.Name,
                    Amount = g.Sum(t => t.Amount),
                    Color = g.Key.Color ?? "#888888",
                    Percentage = 0
                })
                .OrderByDescending(x => x.Amount)
                .ToListAsync();

            var total = pieChartData.Sum(x => x.Amount);
            if (total > 0)
                foreach (var item in pieChartData)
                    item.Percentage = Math.Round((item.Amount / total) * 100, 2);

            return Ok(pieChartData);
        }

        /// <summary>
        /// Line graph: daily income + expense over time.
        /// Also used by the frontend for summary totals (replaces income-expense-comparison).
        /// </summary>
        [HttpGet("line-graph")]
        public async Task<ActionResult<IEnumerable<IncomeExpenseComparisonDTO>>> GetLineGraphData(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            var (from, to) = ResolveDateRange(fromDate, toDate);
            if (from > to) return BadRequest("FromDate cannot be greater than ToDate");

            // Guard: avoid generating huge date ranges (cap at 2 years)
            if ((to - from).TotalDays > 730)
                from = to.AddDays(-730);

            var rawData = await _context.Transactions
                .Where(t => t.Date.Date >= from && t.Date.Date <= to)
                .GroupBy(t => t.Date.Date)
                .Select(g => new IncomeExpenseComparisonDTO
                {
                    Date = g.Key,
                    Income = g.Where(t => t.Type == TransactionTypeEnum.INCOME).Sum(t => t.Amount),
                    Expense = g.Where(t => t.Type == TransactionTypeEnum.EXPENSE).Sum(t => t.Amount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Fill missing dates only when range is reasonable (≤ 90 days)
            if ((to - from).TotalDays <= 90)
            {
                var allDates = GenerateDateRange(from, to);
                return Ok(allDates.Select(date => new IncomeExpenseComparisonDTO
                {
                    Date = date,
                    Income = rawData.FirstOrDefault(d => d.Date == date)?.Income ?? 0,
                    Expense = rawData.FirstOrDefault(d => d.Date == date)?.Expense ?? 0
                }));
            }

            return Ok(rawData);
        }

        /// <summary>
        /// Monthly income vs expense comparison (grouped by month, not day).
        /// Used for the bar chart and summary cards.
        /// </summary>
        [HttpGet("income-expense-comparison")]
        public async Task<ActionResult<IEnumerable<IncomeExpenseComparisonDTO>>> GetIncomeExpenseComparison(
     [FromQuery] DateTime? fromDate,
     [FromQuery] DateTime? toDate)
        {
            var (from, to) = ResolveDateRange(fromDate, toDate);
            if (from > to) return BadRequest("FromDate cannot be greater than ToDate");

            // Step 1: Fetch raw grouped data from DB (EF-translatable query)
            var rawData = await _context.Transactions
                .Where(t => t.Date.Date >= from && t.Date.Date <= to)
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Income = g.Where(t => t.Type == TransactionTypeEnum.INCOME).Sum(t => t.Amount),
                    Expense = g.Where(t => t.Type == TransactionTypeEnum.EXPENSE).Sum(t => t.Amount)
                })
                .ToListAsync(); 

            // Step 2: Project to DTO in memory (new DateTime() not EF-translatable)
            var comparisonData = rawData
                .Select(g => new IncomeExpenseComparisonDTO
                {
                    Date = new DateTime(g.Year, g.Month, 1),
                    Income = g.Income,
                    Expense = g.Expense
                })
                .OrderBy(x => x.Date)
                .ToList();

            return Ok(comparisonData);
        }

        private List<DateTime> GenerateDateRange(DateTime fromDate, DateTime toDate)
        {
            var dates = new List<DateTime>();
            var current = fromDate.Date;
            while (current <= toDate.Date)
            {
                dates.Add(current);
                current = current.AddDays(1);
            }
            return dates;
        }
    }
}