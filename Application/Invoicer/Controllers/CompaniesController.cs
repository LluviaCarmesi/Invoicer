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
        // GET Methods
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
                return BadRequest(new { response = companyIDValidation.Result });
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
                return BadRequest(new { response = companyIDValidation.Result });
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
                return BadRequest(new { response = companyIDValidation.Result });
            }
            if (!limitandOffsetValidation.IsSuccessful)
            {
                return BadRequest(new { response = limitandOffsetValidation.Result });
            }
            return TransactionsServices.GetTransactions(Request.Query[AppSettings.LIMIT_QUERY_PARAMETER], Request.Query[AppSettings.OFFSET_QUERY_PARAMETER], companyID);
        }

        // POST Methods
        [HttpPost("add-company")]
        public IActionResult AddCompany()
        {
            Task<CompaniesServiceRequest> companyModelValidation = CompaniesServicesValidation.CheckCompanyModel(Request);
            CompaniesServiceRequest companyModelValidationResult = companyModelValidation.Result;
            if (!companyModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = companyModelValidationResult.Result });
            }
            CommonServiceRequest companyAddValidation = CompaniesServices.AddCompany(companyModelValidation.Result.Company);
            if (!companyAddValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyAddValidation.Result });
            }
            return Ok(new { response = companyAddValidation.Result });
        }
        [Route("{companyID}/add-transaction")]
        [HttpPost("{companyID}/add-transaction")]
        public IActionResult AddTransaction(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyIDValidation.Result });
            }
            Task<TransactionsServiceRequest> transactionModelValidation = TransactionsServicesValidation.CheckTransactionModel(Request, int.Parse(companyID));
            TransactionsServiceRequest transactionModelValidationResult = transactionModelValidation.Result;
            if (!transactionModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = transactionModelValidationResult.Result });
            }
            CommonServiceRequest transactionAddValidation = TransactionsServices.AddTransaction(transactionModelValidationResult.Transaction);
            if (!transactionAddValidation.IsSuccessful)
            {
                return BadRequest(new { response = transactionAddValidation.Result });
            }
            return Ok(new { response = transactionAddValidation.Result });
        }

        // PUT Methods
        [Route("edit-company/{companyID}")]
        [HttpPut("edit-company/{companyID}")]
        public IActionResult EditCompany(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyIDValidation.Result });
            }
            return Ok(new {response = "API succesfully called."});
        }
    }
}