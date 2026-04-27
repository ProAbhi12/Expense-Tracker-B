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

        [HttpGet("pie-chart")]
        public async Task<ActionResult<IEnumerable<PieChartDataDTO>>> GetPieChartData([FromQuery] DateRangeParameters parameters)
        {
            // SAFETY: Set default dates if empty
            DateTime start = parameters.FromDate ?? DateTime.UtcNow.AddMonths(-1);
            DateTime end = parameters.ToDate ?? DateTime.UtcNow;

            var pieChartData = await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.EXPENSE &&
                            t.Date.Date >= start.Date &&
                            t.Date.Date <= end.Date)
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
            {
                foreach (var item in pieChartData)
                {
                    item.Percentage = Math.Round((item.Amount / total) * 100, 2);
                }
            }

            return Ok(pieChartData);
        }

        [HttpGet("line-graph")]
        public async Task<ActionResult<IEnumerable<LineGraphDataDTO>>> GetLineGraphData([FromQuery] DateRangeParameters parameters)
        {
            // SAFETY: Set default dates if empty
            DateTime start = parameters.FromDate ?? DateTime.UtcNow.AddDays(-7); // Default to last 7 days
            DateTime end = parameters.ToDate ?? DateTime.UtcNow;

            var lineGraphData = await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.EXPENSE &&
                            t.Date.Date >= start.Date &&
                            t.Date.Date <= end.Date)
                .GroupBy(t => t.Date.Date)
                .Select(g => new LineGraphDataDTO
                {
                    Date = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            var allDates = GenerateDateRange(start, end);
            var completeLineGraphData = allDates
                .GroupJoin(lineGraphData,
                    date => date,
                    data => data.Date,
                    (date, dataGroup) => new LineGraphDataDTO
                    {
                        Date = date,
                        Amount = dataGroup.FirstOrDefault()?.Amount ?? 0
                    })
                .ToList();

            return Ok(completeLineGraphData);
        }

        [HttpGet("income-expense-comparison")]
        public async Task<ActionResult<IEnumerable<IncomeExpenseComparisonDTO>>> GetIncomeExpenseComparison([FromQuery] DateRangeParameters parameters)
        {
            // SAFETY: Set default dates if empty
            DateTime start = parameters.FromDate ?? DateTime.UtcNow.AddDays(-7);
            DateTime end = parameters.ToDate ?? DateTime.UtcNow;

            var comparisonData = await _context.Transactions
                .Where(t => t.Date.Date >= start.Date &&
                            t.Date.Date <= end.Date)
                .GroupBy(t => t.Date.Date)
                .Select(g => new IncomeExpenseComparisonDTO
                {
                    Date = g.Key,
                    Income = g.Where(t => t.Type == TransactionTypeEnum.INCOME).Sum(t => t.Amount),
                    Expense = g.Where(t => t.Type == TransactionTypeEnum.EXPENSE).Sum(t => t.Amount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            var allDates = GenerateDateRange(start, end);
            var completeComparisonData = allDates
                .GroupJoin(comparisonData,
                    date => date,
                    data => data.Date,
                    (date, dataGroup) => new IncomeExpenseComparisonDTO
                    {
                        Date = date,
                        Income = dataGroup.FirstOrDefault()?.Income ?? 0,
                        Expense = dataGroup.FirstOrDefault()?.Expense ?? 0
                    })
                .ToList();

            return Ok(completeComparisonData);
        }

        private List<DateTime> GenerateDateRange(DateTime fromDate, DateTime toDate)
        {
            var dates = new List<DateTime>();
            var current = fromDate.Date;
            
            // Added extra safety to prevent infinite loop
            int safetyCounter = 0;
            while (current <= toDate.Date && safetyCounter < 1000)
            {
                dates.Add(current);
                current = current.AddDays(1);
                safetyCounter++;
            }

            return dates;
        }
    }
}
