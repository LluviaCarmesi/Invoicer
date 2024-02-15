using Microsoft.AspNetCore.Mvc;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/remaining-balance")]
    public class RemainingBalancesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetRemainingBalance()
        {
            return Ok("");
        }
    }
}
