using Invoicer.models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Text;

namespace Invoicer.Utilities.Validation
{
    public static class CompaniesServicesValidation
    {
        public static async Task<CompaniesServiceRequest> CheckCompanyModel(HttpRequest request)
        {
            Company company = new Company();
            bool isValid = true;
            string result = string.Empty;
            if (request.Body == null)
            {
                isValid = false;
                result = ENUSStrings.NoBodyError;
                return new CompaniesServiceRequest(isValid, result, company);
            }

            StreamReader reader = new StreamReader(request.Body, Encoding.UTF8);
            string requestBody = await reader.ReadToEndAsync();
            dynamic requestData = JsonConvert.DeserializeObject(requestBody);

            //name validation
            object nameObject;
            string name = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, "name", out nameObject))
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
            //phone validation
            object phoneObject;
            string phone = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, "phone", out phoneObject))
            {
                isValid = false;
                result = ENUSStrings.PhonePropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(name, out phone))
            {
                isValid = false;
                result = ENUSStrings.PhonePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Phone = phone;
            }
            return new CompaniesServiceRequest(isValid, result, company);
        }
    }
}
