using Invoicer.Models.ServiceRequests;
using Invoicer.Services;
using Invoicer.Utilities.Validation;
using Microsoft.AspNetCore.Mvc;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        // GET Methods
        [HttpGet]
        public IActionResult GetCustomers()
        {
            return CustomerServices.GetCustomers(string.Empty, string.Empty);
        }

        [HttpGet("{customerID}")]
        public IActionResult GetCustomer(string customerID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckCustomerIDParameter(customerID);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            return CustomerServices.GetCustomer(customerID);
        }

        [Route("{customerID}/transactions")]
        [HttpGet("{customerID}/transactions")]
        public IActionResult GetCustomerTransactions(string customerID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckCustomerIDParameter(customerID);
            CommonServiceRequest limitandOffsetValidation = CommonValidation.CheckLimitandOffsetParameters(Request);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            if (!limitandOffsetValidation.IsSuccessful)
            {
                return BadRequest(new { response = limitandOffsetValidation.Result });
            }
            return TransactionsServices.GetTransactions(Request.Query[AppSettings.LIMIT_QUERY_PARAMETER], Request.Query[AppSettings.OFFSET_QUERY_PARAMETER], customerID);
        }

        // POST Methods
        [HttpPost("add-customer")]
        public IActionResult AddCustomer()
        {
            Task<CustomersServiceRequest> customerModelValidation = CustomersServicesValidation.CheckCustomerModel(Request);
            CustomersServiceRequest customerModelValidationResult = customerModelValidation.Result;
            if (!customerModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = customerModelValidationResult.Result });
            }
            CommonServiceRequest customerAddValidation = CustomerServices.AddCustomer(customerModelValidation.Result.Customer);
            if (!customerAddValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerAddValidation.Result });
            }
            return Ok(new { response = customerAddValidation.Result });
        }
        [Route("{customerID}/add-transaction")]
        [HttpPost("{customerID}/add-transaction")]
        public IActionResult AddTransaction(string customerID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckCustomerIDParameter(customerID);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            Task<TransactionsServiceRequest> transactionModelValidation = TransactionsServicesValidation.CheckTransactionModelWithCustomerID(Request, int.Parse(customerID));
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
        [Route("edit-customer/{customerID}")]
        [HttpPut("edit-customer/{customerID}")]
        public IActionResult EditCustomer(string customerID)
        {
            CommonServiceRequest customerIDValidation = CommonValidation.CheckCustomerIDParameter(customerID);
            if (!customerIDValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerIDValidation.Result });
            }
            Task<CustomersServiceRequest> customerModelValidation = CustomersServicesValidation.CheckCustomerModel(Request, int.Parse(customerID));
            CustomersServiceRequest customerModelValidationResult = customerModelValidation.Result;
            if (!customerModelValidationResult.IsSuccessful)
            {
                return BadRequest(new { response = customerModelValidationResult.Result });
            }
            CommonServiceRequest customerEditValidation = CustomerServices.EditCustomer(customerModelValidationResult.Customer);
            if (!customerEditValidation.IsSuccessful)
            {
                return BadRequest(new { response = customerEditValidation.Result });
            }
            return Ok(new { response = customerEditValidation.Result });
        }
    }
}