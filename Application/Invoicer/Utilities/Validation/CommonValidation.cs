using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;

namespace Invoicer.Utilities.Validation
{
    public class CommonValidation
    {
        public static CommonServiceRequest CheckIDParameter(string id, string label)
        {
            bool isValid = true;
            string result = string.Empty;
            if (string.IsNullOrEmpty(id))
            {
                isValid = false;
                result = ENUSStrings.ForgotError + label;
            }
            else if (!int.TryParse(id, out int idInt))
            {
                isValid = false;
                result = label + ENUSStrings.NumberError;
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
