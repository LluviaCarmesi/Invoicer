using Invoicer.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

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
                            reader.GetString(5)
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
                            reader.GetString(5)
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
    }
}
