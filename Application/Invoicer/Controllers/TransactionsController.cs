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
    }
}
