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
            //phone validation
            object phoneObject;
            string phone = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.PhonePropertyLabel, out phoneObject))
            {
                isValid = false;
                result = ENUSStrings.PhonePropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(phoneObject, out phone))
            {
                isValid = false;
                result = ENUSStrings.PhonePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Phone = phone;
            }
            // address validation
            object addressObject;
            string address = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.AddressPropertyLabel, out addressObject))
            {
                isValid = false;
                result = ENUSStrings.AddressPropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(addressObject, out address))
            {
                isValid = false;
                result = ENUSStrings.AddressPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Address = address;
            }
            // city validation
            object cityObject;
            string city = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.CityPropertyLabel, out cityObject))
            {
                isValid = false;
                result = ENUSStrings.CityPropertyLabel+ ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(cityObject, out city))
            {
                isValid = false;
                result = ENUSStrings.CityPropertyLabel+ ENUSStrings.BlankError;
            }
            else
            {
                company.City = city;
            }
            // country validation
            object countryObject;
            string country = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.CountryPropertyLabel, out countryObject))
            {
                isValid = false;
                result = ENUSStrings.CountryPropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(countryObject, out country))
            {
                isValid = false;
                result = ENUSStrings.CountryPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Country = country;
            }
            // zip validation
            object zipObject;
            string zip = string.Empty;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.ZipPropertyLabel, out zipObject))
            {
                isValid = false;
                result = ENUSStrings.ZipPropertyLabel + ENUSStrings.MissingError;
            }
            else if (!CommonValidation.TryGetStringValue(zipObject, out zip))
            {
                isValid = false;
                result = ENUSStrings.ZipPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Zip = zip;
            }
            //  is_account_active validation
            object isAccountActiveObject;
            bool isAccountActive = false;
            if (!CommonValidation.TryGetPropertyValue(requestData, ENUSStrings.ZipPropertyLabel, out zipObject))
            {
                        
            }
            else if (!CommonValidation.TryGetStringValue(zipObject, out zip))
            {
                isValid = false;
                result = ENUSStrings.ZipPropertyLabel + ENUSStrings.BlankError;
            }
            company.IsActive = isAccountActive;
            return new CompaniesServiceRequest(isValid, result, company);
        }
    }
}
