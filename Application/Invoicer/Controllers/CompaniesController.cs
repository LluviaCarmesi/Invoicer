using Invoicer.Services;
using Microsoft.AspNetCore.Mvc;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController
    {
        // Get Methods
        [HttpGet]
        public IActionResult GetCompanies()
        {

            return CompaniesServices.GetCompanies();
        }
    }
}