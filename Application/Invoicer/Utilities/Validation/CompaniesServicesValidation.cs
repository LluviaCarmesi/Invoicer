using Invoicer.Models.ServiceRequests;
using Invoicer.Models;
using Invoicer.Properties.Strings;
using Newtonsoft.Json;
using System.Text;

namespace Invoicer.Utilities.Validation
{
    public class CompaniesServicesValidation
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
            Company requestData = JsonConvert.DeserializeObject<Company>(requestBody);

            // name validation
            string name = requestData.Name;
            if (string.IsNullOrEmpty(name))
            {
                isValid = false;
                result = ENUSStrings.NamePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Name = name;
            }

            // address validation
            string address = requestData.Address;
            if (string.IsNullOrEmpty(address))
            {
                isValid = false;
                result = ENUSStrings.AddressPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Address = address;
            }

            // city validation
            string city = requestData.City;
            if (string.IsNullOrEmpty(city))
            {
                isValid = false;
                result = ENUSStrings.CityPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.City = city;
            }

            // country validation
            string country = requestData.Country;
            if (string.IsNullOrEmpty(country))
            {
                isValid = false;
                result = ENUSStrings.CountryPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Country = country;
            }

            // zip validation
            string zip = requestData.Zip;
            if (string.IsNullOrEmpty(zip))
            {
                isValid = false;
                result = ENUSStrings.ZipPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Zip = zip;
            }

            return new CompaniesServiceRequest(isValid, result, company);
        }

        public static async Task<CompaniesServiceRequest> CheckCompanyModel(HttpRequest request, int id)
        {
            Company company = new Company();
            company.Id = id;
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
            Company requestData = JsonConvert.DeserializeObject<Company>(requestBody);

            // name validation
            string name = requestData.Name;
            if (string.IsNullOrEmpty(name))
            {
                isValid = false;
                result = ENUSStrings.NamePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Name = name;
            }

            // address validation
            string address = requestData.Address;
            if (string.IsNullOrEmpty(address))
            {
                isValid = false;
                result = ENUSStrings.AddressPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Address = address;
            }

            // city validation
            string city = requestData.City;
            if (string.IsNullOrEmpty(city))
            {
                isValid = false;
                result = ENUSStrings.CityPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.City = city;
            }

            // country validation
            string country = requestData.Country;
            if (string.IsNullOrEmpty(country))
            {
                isValid = false;
                result = ENUSStrings.CountryPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Country = country;
            }

            // zip validation
            string zip = requestData.Zip;
            if (string.IsNullOrEmpty(zip))
            {
                isValid = false;
                result = ENUSStrings.ZipPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                company.Zip = zip;
            }

            return new CompaniesServiceRequest(isValid, result, company);
        }
    }
}
