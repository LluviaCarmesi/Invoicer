using Invoicer.models;
using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Services;
using Invoicer.Utilities.Validation;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCompanies()
        {
            return CompaniesServices.GetCompanies(string.Empty, string.Empty);
        }

        [HttpGet("{companyID}")]
        public IActionResult GetCompany(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            return CompaniesServices.GetCompany(companyID);
        }

        [Route("{companyID}/remaining-balance")]
        [HttpGet("{companyID}/remaining-balance")]
        public IActionResult GetRemainingBalance(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            return RemainingBalancesServices.GetRemainingBalance(companyID);
        }

        [Route("{companyID}/transactions")]
        [HttpGet("{companyID}/transactions")]
        public IActionResult GetCompanyTransactions(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            CommonServiceRequest limitandOffsetValidation = TransactionsServicesValidation.CheckLimitandOffsetParameters(Request);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            if (!limitandOffsetValidation.IsSuccessful)
            {
                return BadRequest(limitandOffsetValidation.Result);
            }
            return TransactionsServices.GetTransactions(Request.Query[AppSettings.LIMIT_QUERY_PARAMETER], Request.Query[AppSettings.OFFSET_QUERY_PARAMETER], companyID);
        }
        //POST Methods
        [HttpPost("add-company")]
        public IActionResult AddCompany()
        {
            Task<CompaniesServiceRequest> companyModelValidation = CompaniesServicesValidation.CheckCompanyModel(Request);
            CompaniesServiceRequest companyModelValidationResult = companyModelValidation.Result;
            if (!companyModelValidationResult.IsSuccessful)
            {
                return BadRequest(companyModelValidationResult.Result);
            }
            CommonServiceRequest companyAddValidation = CompaniesServices.AddCompany(companyModelValidation.Result.Company);
            if (!companyAddValidation.IsSuccessful)
            {
                return BadRequest(companyAddValidation.Result);
            }
            return Ok(companyAddValidation.Result);
        }
    }
}