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
            Task<TransactionsServiceRequest> transactionModelValidation = TransactionsServicesValidation.CheckTransactionModelWithTransactionID(Request, int.Parse(transactionID));
            TransactionsServiceRequest transactionModelValidationResult = transactionModelValidation.Result;
            if (!transactionModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = transactionModelValidationResult.Result });
            }
            CommonServiceRequest transactionEditValidation = TransactionsServices.EditTransaction(transactionModelValidationResult.Transaction);
            if (!transactionEditValidation.IsSuccessful)
            {
                return BadRequest(new { response = transactionEditValidation.Result });
            }
            return Ok(new { response = transactionEditValidation.Result });
        }
    }
}
