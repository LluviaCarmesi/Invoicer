using Invoicer.Enums;
using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Text;

namespace Invoicer.Utilities.Validation
{
    public class TransactionsServicesValidation
    {
        public static async Task<TransactionsServiceRequest> CheckTransactionModel(HttpRequest request, int companyID)
        {
            Transaction transaction = new Transaction();
            transaction.CompanyID = companyID;
            bool isValid = true;
            string result = string.Empty;
            if (request.Body == null)
            {
                isValid = false;
                result = ENUSStrings.NoBodyError;
                return new TransactionsServiceRequest(isValid, result, transaction);
            }

            StreamReader reader = new StreamReader(request.Body, Encoding.UTF8);
            string requestBody = await reader.ReadToEndAsync();
            Transaction requestData = JsonConvert.DeserializeObject<Transaction>(requestBody);

            // type validation
            string type = requestData.Type;
            if (string.IsNullOrEmpty(type))
            {
                isValid = false;
                result = ENUSStrings.TypePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                transaction.Type = type;
            }

            // createdDate validation
            DateTime createdDate = requestData.CreatedDate;
            if (createdDate == DateTime.MinValue)
            {
                isValid = false;
                result = ENUSStrings.CreatedDatePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                transaction.CreatedDate = createdDate;
            }

            // dueDate and invoiceData validation
            DateTime dueDate = requestData.DueDate;
            List<InvoiceData> invoiceData = requestData.InvoiceData;
            if (type == TransactionTypes.toFriendlyString(TransactionTypesDefinitions.Invoice))
            {
                if (dueDate == DateTime.MinValue)
                {
                    isValid = false;
                    result = ENUSStrings.DueDatePropertyLabel + ENUSStrings.BlankError;
                }
                else
                {
                    transaction.DueDate = dueDate;
                }

                if (!CheckInvoiceData(invoiceData))
                {
                    isValid = false;
                    result = ENUSStrings.InvoiceDataLabel + ENUSStrings.HasAnIssueError;
                }
                else
                {
                    transaction.InvoiceData = invoiceData;
                }
            }
            // createdDate and checkNumber validation
            DateTime paymentDate = requestData.PaymentDate;
            string checkNumber = requestData.CheckNumber;
            if (type == TransactionTypes.toFriendlyString(TransactionTypesDefinitions.Payment))
            {
                if (paymentDate == DateTime.MinValue)
                {
                    isValid = false;
                    result = ENUSStrings.PaymentDatePropertyLabel + ENUSStrings.BlankError;
                }
                else
                {
                    transaction.PaymentDate = paymentDate;
                }

                if (string.IsNullOrEmpty(checkNumber))
                {
                    isValid = false;
                    result = ENUSStrings.CheckNumberPropertyLabel + ENUSStrings.BlankError;
                }
                else
                {
                    transaction.CheckNumber = checkNumber;
                }
            }
            // total validation
            decimal total = requestData.Total;
            if (total == decimal.MinValue)
            {
                isValid = false;
                result = ENUSStrings.TotalPropertyLabel + ENUSStrings.MissingError;
            }
            else
            {
                transaction.Total = total;
            }
            return new TransactionsServiceRequest(isValid, result, transaction);
        }
        public static CommonServiceRequest CheckTransactionID(string transactionID)
        {
            bool isValid = true;
            string result = string.Empty;
            if (string.IsNullOrEmpty(transactionID))
            {
                isValid = false;
                result = ENUSStrings.ForgotError + ENUSStrings.TransactionIDLabel;
            }
            else if (!int.TryParse(transactionID, out int id))
            {
                isValid = false;
                result = ENUSStrings.TransactionIDLabel + ENUSStrings.NumberError;
            }
            return new CommonServiceRequest(isValid, result);
        }
        public static bool CheckInvoiceData(List<InvoiceData> invoiceData)
        {
            try
            {
                for (int i = 0; i < invoiceData.Count; i++)
                {
                    InvoiceData currentInvoiceData = invoiceData[i];
                    if ((currentInvoiceData.Total == decimal.MinValue) && string.IsNullOrEmpty(currentInvoiceData.Type))
                    {
                        return false;
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static CommonServiceRequest CheckLimitandOffsetParameters(HttpRequest request)
        {
            bool isValid = true;
            string result = string.Empty;
            if (request.Query[AppSettings.LIMIT_QUERY_PARAMETER] == "" && request.Query.ContainsKey(AppSettings.LIMIT_QUERY_PARAMETER))
            {
                isValid = false;
                result = ENUSStrings.LimitLabel + ENUSStrings.BlankError;
            }
            else if (!int.TryParse(request.Query[AppSettings.LIMIT_QUERY_PARAMETER], out int limit) && request.Query.ContainsKey(AppSettings.LIMIT_QUERY_PARAMETER))
            {
                isValid = false;
                result = ENUSStrings.LimitLabel + ENUSStrings.NumberError;
            }
            else if (request.Query[AppSettings.OFFSET_QUERY_PARAMETER] == "" && request.Query.ContainsKey(AppSettings.OFFSET_QUERY_PARAMETER) && request.Query.ContainsKey(AppSettings.LIMIT_QUERY_PARAMETER))
            {
                isValid = false;
                result = ENUSStrings.OffsetLabel + ENUSStrings.BlankError;
            }
            else if (!int.TryParse(request.Query[AppSettings.OFFSET_QUERY_PARAMETER], out int offset) && request.Query.ContainsKey(AppSettings.OFFSET_QUERY_PARAMETER) && request.Query.ContainsKey(AppSettings.LIMIT_QUERY_PARAMETER))
            {
                isValid = false;
                result = ENUSStrings.OffsetLabel + ENUSStrings.NumberError;
            }
            return new CommonServiceRequest(isValid, result);
        }
    }
}
