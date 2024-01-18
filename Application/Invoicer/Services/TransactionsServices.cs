using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.ComponentModel.Design;

namespace Invoicer.Services
{
    public class TransactionsServices
    {
        private static MySqlConnection mySqlConnection = new MySqlConnection(AppSettings.SQL_CONNECTION_STRING);
        internal static IActionResult GetTransaction(string transactionID)
        {
            Transaction transaction = new Transaction();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE id = {transactionID};", mySqlConnection);
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    transaction = new Transaction
                                (
                                    reader.GetInt32(0),
                                    reader.GetString(1),
                                    reader.GetDateTime(2),
                                    reader.GetDateTime(3),
                                    reader.GetString(4),
                                    reader.GetDecimal(5)
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
            return new OkObjectResult(transaction);
        }
        internal static IActionResult GetTransactions(string limitString, string offsetString, string companyID)
        {
            List<Transaction> transactionsList = new List<Transaction>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                if (!string.IsNullOrEmpty(offsetString) && !string.IsNullOrEmpty(limitString))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE company_id = {companyID} {AppSettings.ORDER_BY_ID_DESC} LIMIT {limitString} OFFSET {offsetString};", mySqlConnection);
                }
                else if (!string.IsNullOrEmpty(limitString))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE company_id = {companyID} {AppSettings.ORDER_BY_ID_DESC} LIMIT {limitString};", mySqlConnection);
                }
                else
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE company_id = {companyID} {AppSettings.ORDER_BY_ID_DESC};", mySqlConnection);
                }
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    transactionsList.Add
                        (
                            new Transaction
                                (
                                    reader.GetInt32(0),
                                    reader.GetString(1),
                                    reader.GetDateTime(2),
                                    reader.GetDateTime(3),
                                    reader.GetString(4),
                                    reader.GetDecimal(5)
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
            return new OkObjectResult(transactionsList);
        }
        internal static CommonServiceRequest AddTransaction(Transaction transaction)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlCommand;
            mySqlCommand = new MySqlCommand($"INSERT INTO {AppSettings.TRANSACTIONS_TABLE} ({AppSettings.ADD_TRANSACTION_COLUMNS}) VALUES (@type, @company_id, @created_date, @due_date, @payment_date, @check_number, @total)", mySqlConnection);
            try
            {
                mySqlCommand.Parameters.Add("@type", MySqlDbType.VarChar).Value = transaction.Type;
                mySqlCommand.Parameters.Add("@company_id", MySqlDbType.Int32).Value = transaction.CompanyID;
                mySqlCommand.Parameters.Add("@created_date", MySqlDbType.DateTime).Value = transaction.CreatedDate;
                mySqlCommand.Parameters.Add("@due_date", MySqlDbType.DateTime).Value = transaction.DueDate;
                mySqlCommand.Parameters.Add("@payment_date", MySqlDbType.DateTime).Value = transaction.PaymentDate;
                mySqlCommand.Parameters.Add("@check_number", MySqlDbType.VarChar).Value = transaction.CheckNumber;
                mySqlCommand.Parameters.Add("@total", MySqlDbType.Decimal).Value = transaction.Total;
                mySqlCommand.Connection = mySqlConnection;
                mySqlCommand.ExecuteNonQuery();
                isSuccessful = true;
            }
            catch (Exception e)
            {
                result = "Couldn't add the transaction for the following reason: " + e.Message;
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
