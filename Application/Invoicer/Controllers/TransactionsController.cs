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
        // GET methods
        [HttpGet("{companyID}")]
        public IActionResult GetCompanyTransactions(string companyID)
        {
            CommonServiceRequest companyIDValidation = CommonValidation.CheckCompanyIDParameter(companyID);
            if (!companyIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = companyIDValidation.Result });
            }
            return TransactionsServices.GetTransactions("", "", companyID);
        }
        [HttpGet("{transactionID}")]
        public IActionResult GetTransaction(string transactionID)
        {
            CommonServiceRequest transactionIDValidation = TransactionsServicesValidation.CheckTransactionID(transactionID);
            if (!transactionIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = transactionIDValidation.Result });
            }
            return TransactionsServices.GetTransaction(transactionID);
        }

        // PUT METHODS
        [Route("edit-transaction/{transactionID}")]
        [HttpPut("edit-transaction/{transactionID}")]
        public IActionResult EditTransaction(string transactionID)
        {
            CommonServiceRequest transactionIDValidation = TransactionsServicesValidation.CheckTransactionID(transactionID);
            if (!transactionIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = transactionIDValidation.Result });
            }
            return Ok(new { response = "API succesfully called" });
        }
    }
}
