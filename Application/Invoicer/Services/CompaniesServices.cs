using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Invoicer.Services
{
    public static class CompaniesServices
    {
        private static MySqlConnection mySqlConnection = new MySqlConnection(AppSettings.SQL_CONNECTION_STRING);
        // Gets
        internal static IActionResult GetCompanies()
        {
            List<Company> companies = new List<Company>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                mySqlCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE}", mySqlConnection);
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    companies.Add
                        (
                        new Company
                            (
                            reader.GetInt32(0),
                            reader.GetString(1),
                            reader.GetString(2),
                            reader.GetString(3),
                            reader.GetString(4),
                            reader.GetString(5),
                            reader.GetString(6)
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
            return new OkObjectResult(companies);

        }
        internal static IActionResult GetCompany(string companyID)
        {
            Company company = new Company();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                mySqlCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE} WHERE id = {companyID}", mySqlConnection);
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while(reader.Read())
                {
                    company = new Company
                        (
                            reader.GetInt32(0),
                            reader.GetString(1),
                            reader.GetString(2),
                            reader.GetString(3),
                            reader.GetString(4),
                            reader.GetString(5),
                            reader.GetString(6)
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
            return new OkObjectResult(company);
        }
        // Posts
        internal static CommonServiceRequest AddCompany(Company company)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlCommand;
            mySqlCommand = new MySqlCommand($"INSERT INTO {AppSettings.COMPANIES_TABLE} ({AppSettings.ADD_COMPANIES_COLUMNS}) VALUES (@name, @address, @city, @state, @country, @zip)", mySqlConnection);
            try
            {
                mySqlCommand.Parameters.Add("@name", MySqlDbType.VarChar).Value = company.Name;
                mySqlCommand.Parameters.Add("@address", MySqlDbType.VarChar).Value = company.Address;
                mySqlCommand.Parameters.Add("@city", MySqlDbType.VarChar).Value = company.City;
                mySqlCommand.Parameters.Add("@state", MySqlDbType.VarChar).Value = company.State;
                mySqlCommand.Parameters.Add("@country", MySqlDbType.VarChar).Value = company.Country;
                mySqlCommand.Parameters.Add("@zip", MySqlDbType.VarChar).Value = company.Zip;
                mySqlCommand.Connection = mySqlConnection;
                mySqlCommand.ExecuteNonQuery();
                isSuccessful = true;
                result = ENUSStrings.CompanyAddedSuccessMessage;
            }
            catch (Exception e)
            {
                result = ENUSStrings.CompanyAddedFailedMessage + e.Message;
                isSuccessful = false;
            }
            finally
            {
                mySqlConnection.Close();
            }

            return new CommonServiceRequest(isSuccessful, result);
        }
        internal static CommonServiceRequest EditCompany(Company company)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlCommand;
            mySqlCommand = new MySqlCommand($"UPDATE {AppSettings.COMPANIES_TABLE} SET name = @name, address = @address, city = @city, state = @state, country = @country, zip = @zip WHERE id = @id", mySqlConnection);
            try
            {
                mySqlCommand.Parameters.Add("@id", MySqlDbType.Int32).Value = company.Id;
                mySqlCommand.Parameters.Add("@name", MySqlDbType.VarChar).Value = company.Name;
                mySqlCommand.Parameters.Add("@address", MySqlDbType.VarChar).Value = company.Address;
                mySqlCommand.Parameters.Add("@city", MySqlDbType.VarChar).Value = company.City;
                mySqlCommand.Parameters.Add("@state", MySqlDbType.VarChar).Value = company.State;
                mySqlCommand.Parameters.Add("@country", MySqlDbType.VarChar).Value = company.Country;
                mySqlCommand.Parameters.Add("@zip", MySqlDbType.VarChar).Value = company.Zip;
                mySqlCommand.Connection = mySqlConnection;
                mySqlCommand.ExecuteNonQuery();
                isSuccessful = true;
                result = ENUSStrings.CompanyEditedSuccessMessage;
            }
            catch (Exception e)
            {
                result = ENUSStrings.CompanyEditedFailedMessage + e.Message;
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
