using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Invoicer.Services
{
    public static class CompaniesServices
    {
        private static MySqlConnection mySqlConnection = new MySqlConnection(AppSettings.SQL_CONNECTION_STRING);
        // Gets
        internal static IActionResult GetCompany(string companyID)
        {
            Company company = new Company();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                mySqlCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE} WHERE id = {companyID} {AppSettings.ORDER_BY_ID_DESC}", mySqlConnection);
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    company = new Company
                        (
                            reader.GetInt32(0),
                            reader.GetString(1),
                            reader.GetString(2),
                            reader.GetString(3),
                            reader.GetString(4),
                            reader.GetString(5),
                            reader.GetString(6),
                            reader.GetString(7)
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
        internal static IActionResult GetCompanies(string limitNumber, string offsetNumber)
        {
            List<Company> companiesList = new List<Company>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                if (!string.IsNullOrEmpty(limitNumber))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE} LIMIT {limitNumber}", mySqlConnection);
                }
                else if (!string.IsNullOrEmpty(offsetNumber) && !string.IsNullOrEmpty(limitNumber))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE} LIMIT {limitNumber} OFFSET {offsetNumber}", mySqlConnection);
                }
                else
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE}", mySqlConnection);
                }
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    companiesList.Add
                        (
                            new Company
                                (
                                    reader.GetInt32(0),
                                    reader.GetString(1),
                                    reader.GetString(2),
                                    reader.GetString(3),
                                    reader.GetString(4),
                                    reader.GetString(5),
                                    reader.GetString(6),
                                    reader.GetString(7)
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
            return new OkObjectResult(companiesList);
        }

        // Posts
        internal static CommonServiceRequest AddCompany(Company company)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlCommand;
            mySqlCommand = new MySqlCommand($"INSERT INTO {AppSettings.COMPANIES_TABLE} ({AppSettings.ADD_COMPANY_COLUMNS}) VALUES (@name, @phone, @email, @address, @city, @country, @zip, @is_account_active)", mySqlConnection);
            try
            {
                mySqlCommand.Parameters.Add("@name", MySqlDbType.VarChar).Value = company.Name;
                mySqlCommand.Parameters.Add("@phone", MySqlDbType.VarChar).Value = company.Phone;
                mySqlCommand.Parameters.Add("@email", MySqlDbType.VarChar).Value = company.Email;
                mySqlCommand.Parameters.Add("@address", MySqlDbType.VarChar).Value = company.Address;
                mySqlCommand.Parameters.Add("@city", MySqlDbType.VarChar).Value = company.City;
                mySqlCommand.Parameters.Add("@country", MySqlDbType.VarChar).Value = company.Country;
                mySqlCommand.Parameters.Add("@zip", MySqlDbType.VarChar).Value = company.Zip;
                mySqlCommand.Parameters.Add("@is_account_active", MySqlDbType.Bit).Value = company.IsActive;
                mySqlCommand.Connection = mySqlConnection;
                mySqlCommand.ExecuteNonQuery();
                isSuccessful = true;
                result = ENUSStrings.CompanyAddedSuccessMessage;
            }
            catch (Exception e)
            {
                result = "Couldn't add company for the following reason: " + e.Message;
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
