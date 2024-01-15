using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Services;
using Invoicer.Utilities.Validation;
using Microsoft.AspNetCore.Mvc;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        [HttpGet("{companyID}")]
        public IActionResult GetCompanyTransactions(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            return TransactionsServices.GetTransactions("", "", companyID);
        }
        [HttpGet("{transactionID}")]
        public IActionResult GetTransaction(string transactionID)
        {
            CommonServiceRequest transactionIDValidation = TransactionsServicesValidation.CheckTransactionID(transactionID);
            if (!transactionIDValidation.IsSuccessful)
            {
                return BadRequest(transactionIDValidation.Result);
            }
            return TransactionsServices.GetTransaction(transactionID);
        }
        [Route("companies/{companyID}/add-transaction")]
        [HttpPost("companies/{companyID}/add-transaction")]
        public IActionResult AddTransaction(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(companyIDValidation.Result);
            }
            Task<TransactionsServiceRequest> transactionModelValidation = TransactionsServicesValidation.CheckTransactionModel(Request, int.Parse(companyID));
            TransactionsServiceRequest transactionModelValidationResult = transactionModelValidation.Result;
            if (!transactionModelValidationResult.IsSuccessful)
            {
                return BadRequest(transactionModelValidationResult.Result);
            }
            IActionResult transactionAddValidation = TransactionsServices.AddTransaction(transactionModelValidationResult.Transaction);
            return Ok(transactionAddValidation);
        }
    }
}
