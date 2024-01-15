using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Newtonsoft.Json;
using System.Text;

namespace Invoicer.Utilities.Validation
{
    public class TransactionsServicesValidation
    {
        public static async Task<TransactionsServiceRequest> CheckTransactionModel(HttpRequest request)
        {
            Transaction transaction= new Transaction();
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
            object nameObject;
            string name = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.NamePropertyLabel, out nameObject))
            {
                isValid = false;
                result = ENUSStrings.NamePropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(nameObject, out name))
            {
                isValid = false;
                result = ENUSStrings.NamePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Name = name;
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
