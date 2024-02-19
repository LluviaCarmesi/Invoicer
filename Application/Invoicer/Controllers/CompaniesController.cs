using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Invoicer.Services;
using Invoicer.Utilities.Validation;
using Microsoft.AspNetCore.Mvc;
using System.Text;

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
            StringBuilder CSV = new StringBuilder();
            CSV.AppendLine("companyID, companyName, customerID, customerName, customerEmail, customerPhone, ID, type, createdDate, dueDate, paymentDate, total");

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
        [Route("export-all-companies-customers-transactions")]
        [HttpGet("export-all-companies-customers-transactions")]
        public IActionResult ExportAllCompaniesCustomersTransactions()
        {
            CompaniesCustomersTransactionsServiceRequest companiesCustomersTransactionsServiceRequest = CompaniesServices.GetCompaniesCustomersTransactions();
            if (!companiesCustomersTransactionsServiceRequest.IsSuccessful)
            {
                return BadRequest(new { response = companiesCustomersTransactionsServiceRequest.Result });
            }
            StringBuilder CSV = new StringBuilder();
            CSV.AppendLine("companyID, companyName, customerID, customerName, customerEmail, customerPhone, ID, type, createdDate, dueDate, paymentDate, total");

            for (int i = 0; i < companiesCustomersTransactionsServiceRequest.CompaniesCustomersTransactions.Count; i++)
            {
                CompaniesCustomersTransactions currentIteration = companiesCustomersTransactionsServiceRequest.CompaniesCustomersTransactions[i];
                CSV.AppendLine($"" +
                    $"{currentIteration.CompanyID}," +
                    $"{currentIteration.CompanyName}," +
                    $"{currentIteration.CustomerID}," +
                    $"{currentIteration.CustomerName}," +
                    $"{currentIteration.CustomerEmail}," +
                    $"{currentIteration.CustomerPhone}," +
                    $"{currentIteration.Id}," +
                    $"{currentIteration.Type}," +
                    $"{currentIteration.CreatedDate}," +
                    $"{currentIteration.DueDate}," +
                    $"{currentIteration.PaymentDate}," +
                    $"{currentIteration.Total}");
            }

            byte[] buffer = Encoding.UTF8.GetBytes(CSV.ToString());
            DateTime todaysDate = DateTime.UtcNow;
            return File(buffer, "text/csv", $"companies_customers_transactions{todaysDate.ToShortDateString()}.csv");
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