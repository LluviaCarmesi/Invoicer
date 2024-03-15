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
    public class CompaniesController : ControllerBase
    {
        // Get Methods
        [HttpGet]
        public IActionResult GetCompanies()
        {
            return CompaniesServices.GetCompanies();
        }
        [HttpGet("active")]
        public IActionResult GetActiveCompanies()
        {
            return CompaniesServices.GetActiveCompanies();
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
                CSV.AppendLine(
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
        [Route("export-sql-query-to-build-db")]
        [HttpGet("export-sql-query-to-build-db")]
        public IActionResult ExportSQLQueryToBuildDB()
        {
            CompaniesCustomersTransactionsListsServiceRequest companiesCustomersTransactionsListsServiceRequest =
                CompaniesServices.GetCompaniesCustomersTransactionsLists();
            if (!companiesCustomersTransactionsListsServiceRequest.IsSuccessful)
            {
                return BadRequest(new { response = companiesCustomersTransactionsListsServiceRequest.Result });
            }
            StringBuilder TXT = new StringBuilder();

            for (int i = 0; i < companiesCustomersTransactionsListsServiceRequest.CompaniesCustomersTransactionsLists.Count; i++)
            {
                CompaniesCustomersTransactionsLists companiesCustomersTransactionsLists = companiesCustomersTransactionsListsServiceRequest.CompaniesCustomersTransactionsLists[i];
                TXT.AppendLine(
                    "INSERT INTO companies\r\n" +
                    "(\r\n    name,\r\n    address,\r\n    city,\r\n    " +
                    "state,\r\n    country,\r\n    zip,\r\n    is_active\r\n" +
                    ")\r\nVALUES"
                    );
                for (int j = 0; j < companiesCustomersTransactionsLists.Companies.Count; j++)
                {
                    Company company = companiesCustomersTransactionsLists.Companies[j];
                    if (j + 1 == companiesCustomersTransactionsLists.Companies.Count)
                    {
                        TXT.AppendLine(
                            $"(\"{company.Name}\"," +
                            $"\"{company.Address}\"," +
                            $"\"{company.City}\"," +
                            $"\"{company.State}\"," +
                            $"\"{company.Country}\"," +
                            $"\"{company.Zip}\"," +
                            $"{company.IsActive});\r\n"
                            );
                    }
                    else
                    {
                        TXT.AppendLine(
                            $"(\"{company.Name}\"," +
                            $"\"{company.Address}\"," +
                            $"\"{company.City}\"," +
                            $"\"{company.State}\"," +
                            $"\"{company.Country}\"," +
                            $"\"{company.Zip}\"," +
                            $"{company.IsActive}),"
                            );
                    }
                }
                TXT.AppendLine(
                    "INSERT INTO customers\r\n" +
                    "(\r\n    company_id,\r\n    name,\r\n    phone,\r\n    " +
                    "email,\r\n    address,\r\n    city,\r\n    state,\r\n    " +
                    "country,\r\n    zip,\r\n    is_active\r\n)\r\nVALUES"
                    );
                for (int j = 0; j < companiesCustomersTransactionsLists.Customers.Count; j++)
                {
                    Customer customer = companiesCustomersTransactionsLists.Customers[j];
                    if (j + 1 == companiesCustomersTransactionsLists.Customers.Count)
                    {
                        TXT.AppendLine(
                            $"({customer.CompanyID}," +
                            $"\"{customer.Name}\"," +
                            $"\"{customer.Phone}\"," +
                            $"\"{customer.Email}\"," +
                            $"\"{customer.Address}\"," +
                            $"\"{customer.City}\"," +
                            $"\"{customer.State}\"," +
                            $"\"{customer.Country}\"," +
                            $"\"{customer.Zip}\"," +
                            $"{customer.IsActive});\r\n"
                            );
                    }
                    else
                    {
                        TXT.AppendLine(
                            $"({customer.CompanyID}," +
                            $"\"{customer.Name}\"," +
                            $"\"{customer.Phone}\"," +
                            $"\"{customer.Email}\"," +
                            $"\"{customer.Address}\"," +
                            $"\"{customer.City}\"," +
                            $"\"{customer.State}\"," +
                            $"\"{customer.Country}\"," +
                            $"\"{customer.Zip}\"," +
                            $"{customer.IsActive}),"
                            );
                    }
                }
                TXT.AppendLine(
                    "INSERT INTO transactions\r\n" +
                    "(\r\n    type,\r\n    customer_id,\r\n    created_date,\r\n" +
                    "    due_date,\r\n    payment_date,\r\n    check_number,\r\n" +
                    "    total\r\n)\r\nVALUES"
                    );
                for (int j = 0; j < companiesCustomersTransactionsLists.Transactions.Count; j++)
                {
                    Transaction transaction = companiesCustomersTransactionsLists.Transactions[j];
                    if (j + 1 == companiesCustomersTransactionsLists.Transactions.Count)
                    {
                        TXT.AppendLine(
                            $"(\"{transaction.Type}\"," +
                            $"{transaction.CustomerID}," +
                            $"\"{transaction.CreatedDate.ToString("yyyy-MM-dd HH:mm:ss")}\"," +
                            $"\"{transaction.DueDate.ToString("yyyy-MM-dd HH:mm:ss")}\"," +
                            $"\"{transaction.PaymentDate.ToString("yyyy-MM-dd HH:mm:ss")}\"," +
                            $"\"{transaction.CheckNumber}\"," +
                            $"{transaction.Total});\r\n"
                            );
                    }
                    else
                    {
                        TXT.AppendLine(
                            $"(\"{transaction.Type}\"," +
                            $"{transaction.CustomerID}," +
                            $"\"{transaction.CreatedDate.ToString("yyyy-MM-dd HH:mm:ss")}\"," +
                            $"\"{transaction.DueDate.ToString("yyyy-MM-dd HH:mm:ss")}\"," +
                            $"\"{transaction.PaymentDate.ToString("yyyy-MM-dd HH:mm:ss")}\"," +
                            $"\"{transaction.CheckNumber}\"," +
                            $"{transaction.Total}),"
                            );
                    }
                }
                TXT.AppendLine(
                    "INSERT INTO invoice_data\r\n" +
                    "(\r\n    invoice_id,\r\n    type,\r\n    ticket_number,\r\n    " +
                    "total\r\n)\r\nVALUES"
                    );
                for (int j = 0; j <companiesCustomersTransactionsLists.InvoiceDatas.Count; j++)
                {
                    InvoiceData invoiceData = companiesCustomersTransactionsLists.InvoiceDatas[j];
                    if (j+1 == companiesCustomersTransactionsLists.InvoiceDatas.Count)
                    {
                        TXT.AppendLine(
                            $"({invoiceData.InvoiceID}," +
                            $"\"{invoiceData.Type}\"," +
                            $"\"{invoiceData.TicketNumber}\"," +
                            $"{invoiceData.Total});\r\n"
                            );
                    }
                    else
                    {
                        TXT.AppendLine(
                            $"({invoiceData.InvoiceID}," +
                            $"\"{invoiceData.Type}\"," +
                            $"\"{invoiceData.TicketNumber}\"," +
                            $"{invoiceData.Total}),"
                            );
                    }
                }
            }
            byte[] buffer = Encoding.UTF8.GetBytes(TXT.ToString());
            DateTime todaysDate = DateTime.UtcNow;
            return File(buffer, "text/csv", $"sql_query_to_build_db{todaysDate.ToShortDateString()}.txt");
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
        [HttpPut("edit-company/{companyID}")]
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