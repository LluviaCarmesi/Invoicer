using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;

namespace Invoicer.Utilities.Validation
{
    public class CommonValidation
    {
        public static CommonServiceRequest CheckCompanyIDParameter(string companyID)
        {
            bool isValid = true;
            string result = string.Empty;
            if (string.IsNullOrEmpty(companyID))
            {
                isValid = false;
                result = ENUSStrings.ForgotError + ENUSStrings.CompanyIDLabel;
            }
            else if (!int.TryParse(companyID, out int id))
            {
                isValid = false;
                result = ENUSStrings.CompanyIDLabel + ENUSStrings.NumberError;
            }
            return new CommonServiceRequest(isValid, result);
        }
        public static bool TryGetPropertyValue(dynamic obj, string propertyName, out object propertyValue)
        {
            propertyValue = null;
            try
            {
                propertyValue = obj.GetType().GetProperty(propertyName).GetValue(obj);
                return true;
            }
            catch
            {
                return false;
            }
        }
        public static bool TryGetStringValue(object obj, out string value)
        {
            value = string.Empty;
            try
            {
                value = obj.ToString();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
