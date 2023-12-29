using Microsoft.AspNetCore.Mvc;
using Invoicer.Services;
using Invoicer.Models;
using Invoicer.Utilities.Validation;

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
