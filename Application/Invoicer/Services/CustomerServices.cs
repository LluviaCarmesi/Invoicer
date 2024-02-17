using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Invoicer.Services
{
    public static class CustomerServices
    {
        private static MySqlConnection mySqlConnection = new MySqlConnection(AppSettings.SQL_CONNECTION_STRING);
        // Gets
        internal static IActionResult GetCustomer(string customerID)
        {
            Customer customer = new Customer();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE} WHERE id = {customerID} {AppSettings.ORDER_BY_ID_DESC}", mySqlConnection);
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    customer = new Customer
                        (
                            reader.GetInt32(0),
                            reader.GetInt32(1),
                            reader.GetString(2),
                            reader.GetString(3),
                            reader.GetString(4),
                            reader.GetString(5),
                            reader.GetString(6),
                            reader.GetString(7),
                            reader.GetString(8),
                            reader.GetString(9)
                        );
                }
            }
            catch (Exception error)
            {
                return new BadRequestObjectResult(error.Message);
            }
            finally
            {
                mySqlConnection.Close();
            }
            return new OkObjectResult(customer);
        }
        internal static IActionResult GetCustomers(string limitNumber, string offsetNumber)
        {
            List<Customer> customers = new List<Customer>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                if (!string.IsNullOrEmpty(limitNumber))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE} LIMIT {limitNumber}", mySqlConnection);
                }
                else if (!string.IsNullOrEmpty(offsetNumber) && !string.IsNullOrEmpty(limitNumber))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE} LIMIT {limitNumber} OFFSET {offsetNumber}", mySqlConnection);
                }
                else
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE}", mySqlConnection);
                }
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    customers.Add
                        (
                            new Customer
                                (
                                    reader.GetInt32(0),
                                    reader.GetInt32(1),
                                    reader.GetString(2),
                                    reader.GetString(3),
                                    reader.GetString(4),
                                    reader.GetString(5),
                                    reader.GetString(6),
                                    reader.GetString(7),
                                    reader.GetString(8),
                                    reader.GetString(9)
                                )
                        );
                }
            }
            catch (Exception error)
            {
                return new BadRequestObjectResult(error.Message);
            }
            finally
            {
                mySqlConnection.Close();
            }
            return new OkObjectResult(customers);
        }
        internal static IActionResult GetCompanyCustomers(string limitNumber, string offsetNumber, string companyID)
        {
            List<Customer> customers = new List<Customer>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                if (!string.IsNullOrEmpty(limitNumber))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE} WHERE company_id = {companyID} LIMIT {limitNumber}", mySqlConnection);
                }
                else if (!string.IsNullOrEmpty(offsetNumber) && !string.IsNullOrEmpty(limitNumber))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE} WHERE company_id = {companyID} LIMIT {limitNumber} OFFSET {offsetNumber}", mySqlConnection);
                }
                else
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE} WHERE company_id = {companyID}", mySqlConnection);
                }
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    customers.Add
                        (
                            new Customer
                                (
                                    reader.GetInt32(0),
                                    reader.GetInt32(1),
                                    reader.GetString(2),
                                    reader.GetString(3),
                                    reader.GetString(4),
                                    reader.GetString(5),
                                    reader.GetString(6),
                                    reader.GetString(7),
                                    reader.GetString(8),
                                    reader.GetString(9)
                                )
                        );
                }
            }
            catch (Exception error)
            {
                return new BadRequestObjectResult(error.Message);
            }
            finally
            {
                mySqlConnection.Close();
            }
            return new OkObjectResult(customers);
        }

        // Posts
        internal static CommonServiceRequest AddCustomer(Customer customer)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlCommand;
            mySqlCommand = new MySqlCommand($"INSERT INTO {AppSettings.CUSTOMERS_TABLE} ({AppSettings.ADD_CUSTOMER_COLUMNS}) VALUES (@companyID, @name, @phone, @email, @address, @city, @state, @country, @zip, @is_account_active)", mySqlConnection);
            try
            {
                mySqlCommand.Parameters.Add("@companyID", MySqlDbType.Int32).Value = customer.CompanyID;
                mySqlCommand.Parameters.Add("@name", MySqlDbType.VarChar).Value = customer.Name;
                mySqlCommand.Parameters.Add("@phone", MySqlDbType.VarChar).Value = customer.Phone;
                mySqlCommand.Parameters.Add("@email", MySqlDbType.VarChar).Value = customer.Email;
                mySqlCommand.Parameters.Add("@address", MySqlDbType.VarChar).Value = customer.Address;
                mySqlCommand.Parameters.Add("@city", MySqlDbType.VarChar).Value = customer.City;
                mySqlCommand.Parameters.Add("@state", MySqlDbType.VarChar).Value = customer.State;
                mySqlCommand.Parameters.Add("@country", MySqlDbType.VarChar).Value = customer.Country;
                mySqlCommand.Parameters.Add("@zip", MySqlDbType.VarChar).Value = customer.Zip;
                mySqlCommand.Parameters.Add("@is_account_active", MySqlDbType.Bit).Value = customer.IsActive;
                mySqlCommand.Connection = mySqlConnection;
                mySqlCommand.ExecuteNonQuery();
                isSuccessful = true;
                result = ENUSStrings.CustomerAddedSuccessMessage;
            }
            catch (Exception e)
            {
                result = ENUSStrings.CustomerAddedFailedMessage + e.Message;
                isSuccessful = false;
            }
            finally
            {
                mySqlConnection.Close();
            }

            return new CommonServiceRequest(isSuccessful, result);
        }
        internal static CommonServiceRequest EditCustomer(Customer customer)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlCommand;
            mySqlCommand = new MySqlCommand($"UPDATE {AppSettings.CUSTOMERS_TABLE} SET company_id = @companyID, name = @name, phone = @phone, email = @email, address = @address, city = @city, state = @state, country = @country, zip = @zip, is_account_active = @is_account_active WHERE id = @id", mySqlConnection);
            try
            {
                mySqlCommand.Parameters.Add("@id", MySqlDbType.Int32).Value = customer.Id;
                mySqlCommand.Parameters.Add("@companyID", MySqlDbType.Int32).Value = customer.CompanyID;
                mySqlCommand.Parameters.Add("@name", MySqlDbType.VarChar).Value = customer.Name;
                mySqlCommand.Parameters.Add("@phone", MySqlDbType.VarChar).Value = customer.Phone;
                mySqlCommand.Parameters.Add("@email", MySqlDbType.VarChar).Value = customer.Email;
                mySqlCommand.Parameters.Add("@address", MySqlDbType.VarChar).Value = customer.Address;
                mySqlCommand.Parameters.Add("@city", MySqlDbType.VarChar).Value = customer.City;
                mySqlCommand.Parameters.Add("@state", MySqlDbType.VarChar).Value = customer.State;
                mySqlCommand.Parameters.Add("@country", MySqlDbType.VarChar).Value = customer.Country;
                mySqlCommand.Parameters.Add("@zip", MySqlDbType.VarChar).Value = customer.Zip;
                mySqlCommand.Parameters.Add("@is_account_active", MySqlDbType.Bit).Value = customer.IsActive;
                mySqlCommand.Connection = mySqlConnection;
                mySqlCommand.ExecuteNonQuery();
                isSuccessful = true;
                result = ENUSStrings.CustomerEditedSuccessMessage;
            }
            catch (Exception e)
            {
                result = ENUSStrings.CustomerEditedFailedMessage + e.Message;
                isSuccessful = false;
            }
            finally
            {
                mySqlConnection.Close();
            }

            return new CommonServiceRequest(isSuccessful, result);
        }
    }
}
