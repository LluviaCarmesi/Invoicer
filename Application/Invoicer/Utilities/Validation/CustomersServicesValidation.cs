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
                phone = string.Empty;
            }
            customer.Phone = phone;

            // email validation
            string email = requestData.Email;
            if (string.IsNullOrEmpty(email))
            {
                email = string.Empty;
            }
            customer.Email = email;

            // address validation
            string address = requestData.Address;
            if (string.IsNullOrEmpty(address))
            {
                address = string.Empty;
            }
            customer.Address = address;

            // city validation
            string city = requestData.City;
            if (string.IsNullOrEmpty(city))
            {
                city = string.Empty;
            }
            customer.City = city;

            // state validation
            string state = requestData.State;
            if (string.IsNullOrEmpty(state))
            {
                state = string.Empty;
            }
            customer.State = state;

            // country validation
            string country = requestData.Country;
            if (string.IsNullOrEmpty(country))
            {
                country = string.Empty;
            }
            customer.Country = country;

            // zip validation
            string zip = requestData.Zip;
            if (string.IsNullOrEmpty(zip))
            {
                zip = string.Empty;
            }
            customer.Zip = zip;

            //  is_active validation
            bool isActive = requestData.IsActive;
            customer.IsActive = isActive;
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
                phone = string.Empty;
            }
            customer.Phone = phone;

            // email validation
            string email = requestData.Email;
            if (string.IsNullOrEmpty(email))
            {
                email = string.Empty;
            }
            customer.Email = email;

            // address validation
            string address = requestData.Address;
            if (string.IsNullOrEmpty(address))
            {
                address = string.Empty;
            }
            customer.Address = address;

            // city validation
            string city = requestData.City;
            if (string.IsNullOrEmpty(city))
            {
                city = string.Empty;
            }
            customer.City = city;

            // state validation
            string state = requestData.State;
            if (string.IsNullOrEmpty(state))
            {
                state = string.Empty;
            }
            customer.State = state;

            // country validation
            string country = requestData.Country;
            if (string.IsNullOrEmpty(country))
            {
                country = string.Empty;
            }
            customer.Country = country;

            // zip validation
            string zip = requestData.Zip;
            if (string.IsNullOrEmpty(zip))
            {
                zip = string.Empty;
            }
            customer.Zip = zip;

            //  is_active validation
            bool isActive = requestData.IsActive;
            customer.IsActive = isActive;
            return new CustomersServiceRequest(isValid, result, customer);
        }
    }
}
