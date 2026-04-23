using backend.Data;
using Microsoft.AspNetCore.Mvc;

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
            return Ok("Working");
        }
    }
}
