using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Reflection.PortableExecutable;
using System.Text;

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
        internal static CompaniesCustomersTransactionsServiceRequest GetCompaniesCustomersTransactions()
        {
            string result = string.Empty;
            bool isSuccessful = true;
            List<CompaniesCustomersTransactions> companiesCustomersTransactions = new List<CompaniesCustomersTransactions>();
            List<Company> companies = new List<Company>();
            List<Customer> customers = new List<Customer>();
            List<Transaction> transactions = new List<Transaction>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlGetCompaniesCommand;
                mySqlGetCompaniesCommand = new MySqlCommand($"SELECT {AppSettings.COMPANIES_SELECT_COLUMNS} FROM {AppSettings.COMPANIES_TABLE}", mySqlConnection);
                MySqlDataReader getCompaniesReader = mySqlGetCompaniesCommand.ExecuteReader();
                while (getCompaniesReader.Read())
                {
                    companies.Add
                        (
                        new Company
                            (
                            getCompaniesReader.GetInt32(0),
                            getCompaniesReader.GetString(1),
                            getCompaniesReader.GetString(2),
                            getCompaniesReader.GetString(3),
                            getCompaniesReader.GetString(4),
                            getCompaniesReader.GetString(5),
                            getCompaniesReader.GetString(6)
                            )
                        );
                }
                getCompaniesReader.Close();
                MySqlCommand mySqlGetCustomersCommand;
                mySqlGetCustomersCommand = new MySqlCommand($"SELECT {AppSettings.CUSTOMERS_SELECT_COLUMNS} FROM {AppSettings.CUSTOMERS_TABLE}", mySqlConnection);
                MySqlDataReader getCustomersReader = mySqlGetCustomersCommand.ExecuteReader();
                while (getCustomersReader.Read())
                {
                    customers.Add
                    (
                        new Customer
                        (
                            getCustomersReader.GetInt32(0),
                            getCustomersReader.GetInt32(1),
                            getCustomersReader.GetString(2),
                            getCustomersReader.GetString(3),
                            getCustomersReader.GetString(4),
                            getCustomersReader.GetString(5),
                            getCustomersReader.GetString(6),
                            getCustomersReader.GetString(7),
                            getCustomersReader.GetString(8),
                            getCustomersReader.GetString(9)
                        )
                );
                }
                getCustomersReader.Close();
                MySqlCommand mySqlGetTransactionsCommand;
                mySqlGetTransactionsCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE}", mySqlConnection);
                MySqlDataReader getTransactionsReader = mySqlGetTransactionsCommand.ExecuteReader();
                while (getTransactionsReader.Read())
                {
                    transactions.Add
                    (
                        new Transaction
                        (
                            getTransactionsReader.GetInt32(0),
                            getTransactionsReader.GetInt32(1),
                            getTransactionsReader.GetString(2),
                            getTransactionsReader.GetDateTime(3),
                            getTransactionsReader.GetDateTime(4),
                            getTransactionsReader.GetDateTime(5),
                            getTransactionsReader.GetString(6),
                            getTransactionsReader.GetDecimal(7)
                        )
                    );
                }
                for (int i = 0; i < transactions.Count; i++)
                {
                    Transaction currentTransaction = transactions[i];
                    companiesCustomersTransactions.Add(
                        new CompaniesCustomersTransactions(
                                customers.Where(customer => customer.Id == currentTransaction.CustomerID).ToList()[0].CompanyID,
                                companies.Where(company => company.Id == customers.Where(customer => customer.Id == currentTransaction.CustomerID).ToList()[0].CompanyID).ToList()[0].Name,
                                currentTransaction.CustomerID,
                                customers.Where(customer => customer.Id == currentTransaction.CustomerID).ToList()[0].Name,
                                customers.Where(customer => customer.Id == currentTransaction.CustomerID).ToList()[0].Email,
                                customers.Where(customer => customer.Id == currentTransaction.CustomerID).ToList()[0].Phone,
                                currentTransaction.Id,
                                currentTransaction.Type,
                                currentTransaction.CreatedDate,
                                currentTransaction.DueDate,
                                currentTransaction.PaymentDate,
                                currentTransaction.Total
                            )
                        );
                }
            }
            catch (Exception e)
            {
                result = ENUSStrings.CompaniesCustomersTransactionsExportFailedMessage + e.Message;
                isSuccessful = false;
            }
            finally
            {
                mySqlConnection.Close();
            }
            return new CompaniesCustomersTransactionsServiceRequest(isSuccessful, result, companiesCustomersTransactions);
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
