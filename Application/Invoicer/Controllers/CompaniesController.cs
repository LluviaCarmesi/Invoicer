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
            CommonServiceRequest companyIDValidation = CommonValidation.CheckIDParameter(companyID, ENUSStrings.CompanyIDLabel);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyIDValidation.Result });
            }
            return CompaniesServices.GetCompany(companyID);
        }
        [HttpGet("{companyID}/customers")]
        public IActionResult GetCompanyCustomers(string companyID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckIDParameter(companyID, ENUSStrings.CompanyIDLabel);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            return CustomerServices.GetCompanyCustomers(Request.Query[AppSettings.LIMIT_QUERY_PARAMETER], Request.Query[AppSettings.OFFSET_QUERY_PARAMETER], companyID);
        }

        // Post Methods
        [HttpPost("add-company")]
        public IActionResult AddCompany()
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
        [Route("edit-company/{companyID}")]
        [HttpPost("edit-company/{companyID}")]
        public IActionResult EditCompany(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckIDParameter(companyID, ENUSStrings.CompanyIDLabel);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyIDValidation.Result });
            }
            Task<CompaniesServiceRequest> companyModelValidation = CompaniesServicesValidation.CheckCompanyModel(Request, int.Parse(companyID));
            CompaniesServiceRequest companyModelValidationResult = companyModelValidation.Result;
            if (!companyModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = companyModelValidationResult.Result });
            }
            CommonServiceRequest companyEditValidation = CompaniesServices.EditCompany(companyModelValidationResult.company);
            if (!companyEditValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyEditValidation.Result });
            }
            return Ok(new { response = companyEditValidation.Result });
        }
    }
}