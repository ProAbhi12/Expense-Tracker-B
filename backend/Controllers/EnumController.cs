using backend.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class EnumController : Controller
    {
        [HttpGet("api/enums/transaction-methods")]
        public IActionResult GetTransactionMethods()
        {
            var methods = Enum.GetValues<TransactionMethod>()
                .Select(m => new {
                    value = (int)m,
                    label = m.ToString()
                });
            return Ok(methods);
        }
    }
}
