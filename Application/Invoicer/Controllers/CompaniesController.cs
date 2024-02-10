using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Invoicer.Services;
using Invoicer.Utilities.Validation;
using Microsoft.AspNetCore.Mvc;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController: ControllerBase
    {
        // Get Methods
        [HttpGet]
        public IActionResult GetCompanies()
        {
            return CompaniesServices.GetCompanies();
        }
        [HttpGet("{companyID}")]
        public IActionResult GetCompany(string companyID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckIDParameter(companyID, ENUSStrings.CompanyIDLabel);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            return CustomerServices.GetCustomer(companyID);
        }
        [HttpGet("{companyID}/customers")]
        public IActionResult GetCompanyCustomers(string companyID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckIDParameter(companyID, ENUSStrings.CompanyIDLabel);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            return new OkObjectResult(new { response = "Success" });
        }

        // Post Methods
        [HttpPost("add-company")]
        public IActionResult AddCustomer()
        {
            Task<CompaniesServiceRequest> companyModelValidation = CompaniesServicesValidation.CheckCompanyModel(Request);
            CompaniesServiceRequest companyModelValidationResult = companyModelValidation.Result;
            if (!companyModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = companyModelValidationResult.Result });
            }
            CommonServiceRequest companyAddValidation = CompaniesServices.AddCompany(companyModelValidationResult.company);
            if (!companyAddValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyAddValidation.Result });
            }
            return Ok(new { response = companyAddValidation.Result });
        }

        // Put Methods
    }
}