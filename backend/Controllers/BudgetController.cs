using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BudgetController(ApplicationDbContext context)
        {
            _context = context;
        }

        // CREATE Budget
        [HttpPost]
        public async Task<IActionResult> CreateBudget(BudgetDto dto)
        {
            var budget = new Budget
            {
                CategoryId = dto.CategoryId,
                Amount = dto.Amount,
                Month = dto.Month,
                Year = dto.Year
            };

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            return Ok(budget);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .ThenInclude(c => c.Transactions)
                .Select(b => new BudgetResponseDto
                {
                    Id = b.Id,
                    Amount = b.Amount,
                    Month = b.Month,
                    Year = b.Year,
                    CategoryName = b.Category.Name,

                    Spent = b.Category.Transactions
                        .Sum(t => (decimal?)t.Amount) ?? 0,

                    Remaining = b.Amount -
                        (b.Category.Transactions.Sum(t => (decimal?)t.Amount) ?? 0)
                })
                .ToListAsync();

            return Ok(budgets);
        }
        // GET BY ID
        [HttpGet("{id}")]

        public async Task<IActionResult> GetById(int id)
        {
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .ThenInclude(c => c.Transactions)
                .Where(b => b.Id == id)
                   .Select(b => new BudgetResponseDto
                   {
                       Id = b.Id,
                       Amount = b.Amount,
                       Month = b.Month,
                       Year = b.Year,
                       CategoryName = b.Category.Name,

                       Spent = b.Category.Transactions
                        .Sum(t => (decimal?)t.Amount) ?? 0,

                       Remaining = b.Amount -
                        (b.Category.Transactions.Sum(t => (decimal?)t.Amount) ?? 0)
                   })
                .FirstOrDefaultAsync();

            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BudgetDto dto)
        {
            var budget = await _context.Budgets.FindAsync(id);

            if (budget == null)
                return NotFound();

            budget.CategoryId = dto.CategoryId;
            budget.Amount = dto.Amount;
            budget.Month = dto.Month;
            budget.Year = dto.Year;

            await _context.SaveChangesAsync();

            return Ok(budget);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var budget = await _context.Budgets.FindAsync(id);

            if (budget == null)
                return NotFound();

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return Ok("Deleted successfully");
        }
    }
}
