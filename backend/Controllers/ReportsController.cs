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

        /// <summary>
        /// Get pie chart data showing expenses by category within a date range
        /// </summary>
        [HttpGet("pie-chart")]
        public async Task<ActionResult<IEnumerable<PieChartDataDTO>>> GetPieChartData([FromQuery] DateRangeParameters parameters)
        {
            if (fromDate > toDate)
                return BadRequest("FromDate cannot be greater than ToDate");

            // Filter expenses by date range and group by category
            var pieChartData = await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.EXPENSE &&
                            t.Date.Date >= fromDate.Date &&
                            t.Date.Date <= toDate.Date)
                .GroupBy(t => new { t.CategoryId, t.Category.Name, t.Category.Color })
                .Select(g => new PieChartDataDTO
                {
                    CategoryName = g.Key.Name,
                    Amount = g.Sum(t => t.Amount),
                    Color = g.Key.Color ?? "#888888",
                    Percentage = 0 // Will be calculated on client side
                })
                .OrderByDescending(x => x.Amount)
                .ToListAsync();

            // Calculate percentages
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

        /// <summary>
        /// Get line graph data showing daily expenses over time
        /// </summary>
        [HttpGet("line-graph")]
        public async Task<ActionResult<IEnumerable<LineGraphDataDTO>>> GetLineGraphData([FromQuery] DateRangeParameters parameters)
        {
            if (fromDate > toDate)
                return BadRequest("FromDate cannot be greater than ToDate");

            // Group transactions by date and sum expenses for each day
            var lineGraphData = await _context.Transactions
                .Where(t => t.Type == TransactionTypeEnum.EXPENSE &&
                            t.Date.Date >= fromDate.Date &&
                            t.Date.Date <= toDate.Date)
                .GroupBy(t => t.Date.Date)
                .Select(g => new LineGraphDataDTO
                {
                    Date = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Fill in missing dates with zero values for continuous line graph
            var allDates = GenerateDateRange(fromDate, toDate);
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

        /// <summary>
        /// Get income vs expense comparison over time
        /// </summary>
        [HttpGet("income-expense-comparison")]
        public async Task<ActionResult<IEnumerable<IncomeExpenseComparisonDTO>>> GetIncomeExpenseComparison([FromQuery] DateRangeParameters parameters)
        {
            if (fromDate > toDate)
                return BadRequest("FromDate cannot be greater than ToDate");

            var comparisonData = await _context.Transactions
                .Where(t => t.Date.Date >= fromDate.Date &&
                            t.Date.Date <= toDate.Date)
                .GroupBy(t => t.Date.Date)
                .Select(g => new IncomeExpenseComparisonDTO
                {
                    Date = g.Key,
                    Income = g.Where(t => t.Type == TransactionTypeEnum.INCOME).Sum(t => t.Amount),
                    Expense = g.Where(t => t.Type == TransactionTypeEnum.EXPENSE).Sum(t => t.Amount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Fill in missing dates for continuous comparison
            var allDates = GenerateDateRange(fromDate, toDate);
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

        /// <summary>
        /// Helper method to generate a list of dates between two dates
        /// </summary>
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
