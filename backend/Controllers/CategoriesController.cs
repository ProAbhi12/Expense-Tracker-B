using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get All
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Categories.ToListAsync();
            return Ok(data);
        }

        // Get By Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _context.Categories.FindAsync(id);
            if (data == null)
                return NotFound();
            return Ok(data);
        }

        //Create 
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                Type = (TransactionTypeEnum)dto.Type,
                Icon = dto.Icon,
                Color = dto.Color,
                Budget = dto.Budget,
                IsDefault = dto.IsDefault
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        //Update
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category model)
        {
            var data = await _context.Categories.FindAsync(id);

            if (data == null)
                return NotFound();

            data.Name = model.Name;
            data.Type = model.Type;
            data.Icon = model.Icon;
            data.Color = model.Color;
            data.Budget = model.Budget;
            data.IsDefault = model.IsDefault;

            await _context.SaveChangesAsync();

            return Ok(data);
        }
        //Delete 
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var data = await _context.Categories.FindAsync(id);

            if (data == null)
                return NotFound();

            _context.Categories.Remove(data);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
