using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using System.Threading.Tasks.Dataflow;

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
    }
}
