using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Newtonsoft.Json;
using System.Text;

namespace Invoicer.Utilities.Validation
{
    public class CustomersServicesValidation
    {
        public static async Task<CustomersServiceRequest> CheckCustomerModel(HttpRequest request)
        {
            Customer customer = new Customer();
            bool isValid = true;
            string result = string.Empty;
            if (request.Body == null)
            {
                isValid = false;
                result = ENUSStrings.NoBodyError;
                return new CustomersServiceRequest(isValid, result, customer);
            }

            StreamReader reader = new StreamReader(request.Body, Encoding.UTF8);
            string requestBody = await reader.ReadToEndAsync();
            Customer requestData = JsonConvert.DeserializeObject<Customer>(requestBody);
            
            // companyID validation
            int companyID = requestData.CompanyID;
            if (companyID == int.MinValue)
            {
                isValid = false;
                result = ENUSStrings.CompanyIDLabel + ENUSStrings.BlankError;
            }
            else if (companyID == 0)
            {
                isValid = false;
                result = ENUSStrings.CompanyIDLabel + ENUSStrings.ZeroError;
            }
            else
            {
                customer.CompanyID = companyID;
            }

            // name validation
            string name = requestData.Name;
            if (string.IsNullOrEmpty(name))
            {
                isValid = false;
                result = ENUSStrings.NamePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                customer.Name = name;
            }

            // phone validation
            string phone = requestData.Phone;
            if (string.IsNullOrEmpty(phone))
            {
                isValid = false;
                result = ENUSStrings.PhonePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                customer.Phone = phone;
            }

            // email validation
            string email = requestData.Email;
            if (string.IsNullOrEmpty(email))
            {
                isValid = false;
                result = ENUSStrings.EmailPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                customer.Email = email;
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
                customer.Address = address;
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
                customer.City = city;
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
                customer.Country = country;
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
                customer.Zip = zip;
            }

            //  is_account_active validation
            bool isAccountActive = requestData.IsActive;
            customer.IsActive = isAccountActive;
            return new CustomersServiceRequest(isValid, result, customer);
        }

        public static async Task<CustomersServiceRequest> CheckCustomerModel(HttpRequest request, int id)
        {
            Customer customer = new Customer();
            customer.Id = id;
            bool isValid = true;
            string result = string.Empty;
            if (request.Body == null)
            {
                isValid = false;
                result = ENUSStrings.NoBodyError;
                return new CustomersServiceRequest(isValid, result, customer);
            }

            StreamReader reader = new StreamReader(request.Body, Encoding.UTF8);
            string requestBody = await reader.ReadToEndAsync();
            Customer requestData = JsonConvert.DeserializeObject<Customer>(requestBody);

            // companyID validation
            int companyID = requestData.CompanyID;
            if (companyID == int.MinValue)
            {
                isValid = false;
                result = ENUSStrings.CompanyIDLabel + ENUSStrings.BlankError;
            }
            else if (companyID == 0)
            {
                isValid = false;
                result = ENUSStrings.CompanyIDLabel + ENUSStrings.ZeroError;
            }
            else
            {
                customer.CompanyID = companyID;
            }

            // name validation
            string name = requestData.Name;
            if (string.IsNullOrEmpty(name))
            {
                isValid = false;
                result = ENUSStrings.NamePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                customer.Name = name;
            }

            // phone validation
            string phone = requestData.Phone;
            if (string.IsNullOrEmpty(phone))
            {
                isValid = false;
                result = ENUSStrings.PhonePropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                customer.Phone = phone;
            }

            // email validation
            string email = requestData.Email;
            if (string.IsNullOrEmpty(email))
            {
                isValid = false;
                result = ENUSStrings.EmailPropertyLabel + ENUSStrings.BlankError;
            }
            else
            {
                customer.Email = email;
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
                customer.Address = address;
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
                customer.City = city;
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
                customer.Country = country;
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
                customer.Zip = zip;
            }

            //  is_account_active validation
            bool isAccountActive = requestData.IsActive;
            customer.IsActive = isAccountActive;
            return new CustomersServiceRequest(isValid, result, customer);
        }
    }
}
