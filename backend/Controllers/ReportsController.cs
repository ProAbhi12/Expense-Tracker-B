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
        /// Get pie chart data showing transactions by category within a date range
        /// Optional transactionType parameter: "INCOME", "EXPENSE", or null for both
        /// </summary>
        [HttpGet("pie-chart")]
        public async Task<ActionResult<IEnumerable<PieChartDataDTO>>> GetPieChartData([FromQuery] DateRangeParameters parameters, [FromQuery] string? transactionType = null)
        {
            if (parameters.FromDate > parameters.ToDate)
                return BadRequest("FromDate cannot be greater than ToDate");

            // Build query with optional transaction type filter
            var query = _context.Transactions
                .Where(t => t.Date.Date >= parameters.FromDate.Date &&
                            t.Date.Date <= parameters.ToDate.Date);

            // Filter by transaction type if specified
            if (!string.IsNullOrEmpty(transactionType))
            {
                if (transactionType.Equals("INCOME", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(t => t.Type == TransactionTypeEnum.INCOME);
                }
                else if (transactionType.Equals("EXPENSE", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(t => t.Type == TransactionTypeEnum.EXPENSE);
                }
            }

            // Group by category
            var pieChartData = await query
                .GroupBy(t => new { t.CategoryId, t.Category.Name, t.Category.Color })
                .Select(g => new PieChartDataDTO
                {
                    CategoryName = g.Key.Name,
                    Amount = g.Sum(t => t.Amount),
                    Color = g.Key.Color ?? "#888888",
                    Percentage = 0 // Will be calculated below
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
        /// Get line graph data showing daily transactions over time
        /// Optional transactionType parameter: "INCOME", "EXPENSE", or null for both
        /// </summary>
        [HttpGet("line-graph")]
        public async Task<ActionResult<IEnumerable<IncomeExpenseComparisonDTO>>> GetLineGraphData([FromQuery] DateRangeParameters parameters, [FromQuery] string? transactionType = null)
        {
            if (parameters.FromDate > parameters.ToDate)
                return BadRequest("FromDate cannot be greater than ToDate");

            var comparisonData = await _context.Transactions
                .Where(t => t.Date.Date >= parameters.FromDate.Date &&
                            t.Date.Date <= parameters.ToDate.Date)
                .GroupBy(t => t.Date.Date)
                .Select(g => new IncomeExpenseComparisonDTO
                {
                    Date = g.Key,
                    Income = g.Where(t => t.Type == TransactionTypeEnum.INCOME).Sum(t => t.Amount),
                    Expense = g.Where(t => t.Type == TransactionTypeEnum.EXPENSE).Sum(t => t.Amount)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // If specific transaction type is requested, filter the results
            if (!string.IsNullOrEmpty(transactionType))
            {
                if (transactionType.Equals("INCOME", StringComparison.OrdinalIgnoreCase))
                {
                    comparisonData = comparisonData
                        .Where(x => x.Income > 0)
                        .ToList(); 
                }
                else if (transactionType.Equals("EXPENSE", StringComparison.OrdinalIgnoreCase))
                {
                    comparisonData = comparisonData
                        .Where(x => x.Expense > 0)
                        .ToList();
                }
            }

            // Fill in missing dates for continuous comparison
            var allDates = GenerateDateRange(parameters.FromDate, parameters.ToDate);
            var completeLineGraphData = allDates
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

            return Ok(completeLineGraphData);
        }

        /// <summary>
        /// Get income vs expense comparison over time
        /// </summary>
        [HttpGet("income-expense-comparison")]
        public async Task<ActionResult<IEnumerable<IncomeExpenseComparisonDTO>>> GetIncomeExpenseComparison([FromQuery] DateRangeParameters parameters)
        {
            if (parameters.FromDate > parameters.ToDate)
                return BadRequest("FromDate cannot be greater than ToDate");

            var comparisonData = await _context.Transactions
                .Where(t => t.Date.Date >= parameters.FromDate.Date &&
                            t.Date.Date <= parameters.ToDate.Date)
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
            var allDates = GenerateDateRange(parameters.FromDate, parameters.ToDate);
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
