using Invoicer.models;
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
        internal static IActionResult AddCompany()
        {
            return new OkObjectResult("");
        }
    }
}
