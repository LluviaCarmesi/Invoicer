using Invoicer.Enums;
using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Newtonsoft.Json;
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
            dynamic requestData = JsonConvert.DeserializeObject(requestBody);

            // type validation
            object typeObject;
            string type = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.TypePropertyLabel, out typeObject))
            {
                isValid = false;
                result = ENUSStrings.TypePropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(typeObject, out type))
            {
                isValid = false;
                result = ENUSStrings.TypePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                transaction.Type = type;
            }

            // createdDate validation
            object createdDateObject;
            DateTime createdDate;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.CreatedDatePropertyLabel, out createdDateObject))
            {
                isValid = false;
                result = ENUSStrings.CreatedDatePropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetDateValue(createdDateObject, out createdDate))
            {
                isValid = false;
                result = ENUSStrings.CreatedDatePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                transaction.CreatedDate = createdDate;
            }
            // dueDate validation
            object dueDateObject;
            DateTime dueDate;
            if (type == TransactionTypes.toFriendlyString(TransactionTypesDefinitions.Invoice))
            {
                if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.DueDatePropertyLabel, out dueDateObject))
                {
                    isValid = false;
                    result = ENUSStrings.DueDatePropertyLabel + ENUSStrings.MissingError;
                }
                else if (!CommonValidation.TryGetDateValue(dueDateObject, out dueDate))
                {
                    isValid = false;
                    result = ENUSStrings.DueDatePropertyLabel + ENUSStrings.BlankError;
                }
                else
                {
                    transaction.DueDate = dueDate;
                }
            }
            // createdDate and checkNumber validation
            object paymentDateObject;
            DateTime paymentDate;
            object checkNumberObject;
            string checkNumber = string.Empty;
            if (type == TransactionTypes.toFriendlyString(TransactionTypesDefinitions.Payment))
            {
                if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.PaymentDatePropertyLabel, out paymentDateObject))
                {
                    isValid = false;
                    result = ENUSStrings.PaymentDatePropertyLabel + ENUSStrings.MissingError;
                }
                else if (!CommonValidation.TryGetDateValue(createdDateObject, out paymentDate))
                {
                    isValid = false;
                    result = ENUSStrings.PaymentDatePropertyLabel + ENUSStrings.BlankError;
                }
                else
                {
                    transaction.PaymentDate = paymentDate;
                }
                if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.CheckNumberPropertyLabel, out checkNumberObject))
                {
                    isValid = false;
                    result = ENUSStrings.CheckNumberPropertyLabel + ENUSStrings.MissingError;
                }
                else if (!CommonValidation.TryGetStringValue(checkNumberObject, out checkNumber))
                {
                    isValid = false;
                    result = ENUSStrings.CheckNumberPropertyLabel + ENUSStrings.BlankError;
                }
                else
                {
                    transaction.CheckNumber = checkNumber;
                }
            }
            // invoiceData validation
            object invoiceDataObject;
            List<InvoiceData> invoiceData;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.InvoiceDataLabel, out invoiceDataObject))
            {
                isValid = false;
                result = ENUSStrings.InvoiceDataLabel + ENUSStrings.MissingError;
            }
            else if (!TryGetInvoiceData(invoiceDataObject, out invoiceData))
            {
                isValid = false;
                result = ENUSStrings.TotalPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {

            }
            // total validation
            object totalObject;
            decimal total = decimal.MinValue;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.TotalPropertyLabel, out totalObject))
            {
                isValid = false;
                result = ENUSStrings.TotalPropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetDecimalValue(totalObject, out total))
            {
                isValid = false;
                result = ENUSStrings.TotalPropertyLabel + ENUSStrings.BlankError;
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
        public static bool TryGetInvoiceData(object obj, out List<InvoiceData> value)
        {
            value = new List<InvoiceData>();
            try
            {
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
