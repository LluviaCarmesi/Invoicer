using Invoicer.Enums;
using Invoicer.Models;
using Invoicer.Models.ServiceRequests;
using Invoicer.Properties.Strings;
using Invoicer.Utilities.NewFolder;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace Invoicer.Services
{
    public class TransactionsServices
    {
        private static MySqlConnection mySqlConnection = new MySqlConnection(AppSettings.SQL_CONNECTION_STRING);
        internal static IActionResult GetTransaction(string transactionID)
        {
            Transaction transaction = new Transaction();
            List<InvoiceData> invoiceData = new List<InvoiceData>();
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlGetTransactionCommand;
                MySqlCommand mySqlGetInvoiceDataCommand;
                mySqlGetTransactionCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE id = {transactionID};", mySqlConnection);
                mySqlGetInvoiceDataCommand = new MySqlCommand($"SELECT {AppSettings.INVOICE_DATA_SELECT_COLUMNS} FROM {AppSettings.INVOICE_DATA_TABLE} WHERE invoice_id = {transactionID};", mySqlConnection);
                MySqlDataReader getTransactionReader = mySqlGetTransactionCommand.ExecuteReader();
                while (getTransactionReader.Read())
                {
                    transaction = new Transaction
                                (
                                    getTransactionReader.GetInt32(0),
                                    getTransactionReader.GetInt32(1),
                                    getTransactionReader.GetString(2),
                                    getTransactionReader.GetDateTime(3),
                                    getTransactionReader.GetDateTime(4),
                                    getTransactionReader.GetDateTime(5),
                                    getTransactionReader.GetString(6),
                                    getTransactionReader.GetDecimal(7)
                                );
                }
                getTransactionReader.Close();
                MySqlDataReader getInvoiceDataReader = mySqlGetInvoiceDataCommand.ExecuteReader();
                while (getInvoiceDataReader.Read())
                {
                    invoiceData.Add(
                        new InvoiceData(
                            getInvoiceDataReader.GetInt32(0),
                            getInvoiceDataReader.GetInt32(1),
                            getInvoiceDataReader.GetString(2),
                            getInvoiceDataReader.GetString(3),
                            getInvoiceDataReader.GetDecimal(4)
                            )
                        );
                }
                getInvoiceDataReader.Close();
                transaction.InvoiceData = invoiceData;
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
        internal static IActionResult GetTransactions(string limitString, string offsetString, string customerID)
        {
            List<Transaction> transactions = new List<Transaction>();
            decimal invoiceTotal = 0;
            decimal paymentTotal = 0;
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand;
                if (!string.IsNullOrEmpty(offsetString) && !string.IsNullOrEmpty(limitString))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE customer_id = {customerID} {AppSettings.ORDER_BY_ID_DESC} LIMIT {limitString} OFFSET {offsetString};", mySqlConnection);
                }
                else if (!string.IsNullOrEmpty(limitString))
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE customer_id = {customerID} {AppSettings.ORDER_BY_ID_DESC} LIMIT {limitString};", mySqlConnection);
                }
                else
                {
                    mySqlCommand = new MySqlCommand($"SELECT {AppSettings.TRANSACTIONS_SELECT_COLUMNS} FROM {AppSettings.TRANSACTIONS_TABLE} WHERE customer_id = {customerID} {AppSettings.ORDER_BY_ID_DESC};", mySqlConnection);
                }
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    transactions.Add
                        (
                            new Transaction
                                (
                                    reader.GetInt32(0),
                                    reader.GetInt32(1),
                                    reader.GetString(2),
                                    reader.GetDateTime(3),
                                    reader.GetDateTime(4),
                                    reader.GetDateTime(5),
                                    reader.GetString(6),
                                    reader.GetDecimal(7)
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
            for (int i = 0; i < transactions.Count; i++)
            {
                Transaction currentTransaction = transactions[i];
                if (currentTransaction.Type == TransactionTypes.toFriendlyString(TransactionTypesDefinitions.Invoice))
                {
                    invoiceTotal += currentTransaction.Total;
                }
                else
                {
                    paymentTotal += currentTransaction.Total;
                }
            }
            decimal remainingBalance = invoiceTotal - paymentTotal;

            return new OkObjectResult(new TransactionsWithBalance(transactions, remainingBalance));
        }
        internal static CommonServiceRequest AddTransaction(Transaction transaction)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlAddTransactionCommand;
            MySqlCommand mySqlAddInvoiceDataCommand;
            int invoiceDataFails = 0;
            List<InvoiceData> invoiceDataNotAdded = new List<InvoiceData>();
            mySqlAddTransactionCommand = new MySqlCommand($"INSERT INTO {AppSettings.TRANSACTIONS_TABLE} ({AppSettings.ADD_TRANSACTION_COLUMNS}) VALUES (@type, @customer_id, @created_date, @due_date, @payment_date, @check_number, @total)", mySqlConnection);
            try
            {
                mySqlAddTransactionCommand.Parameters.Add("@type", MySqlDbType.VarChar).Value = transaction.Type;
                mySqlAddTransactionCommand.Parameters.Add("@customer_id", MySqlDbType.Int32).Value = transaction.CustomerID;
                mySqlAddTransactionCommand.Parameters.Add("@created_date", MySqlDbType.DateTime).Value = transaction.CreatedDate;
                mySqlAddTransactionCommand.Parameters.Add("@due_date", MySqlDbType.DateTime).Value = transaction.DueDate;
                mySqlAddTransactionCommand.Parameters.Add("@payment_date", MySqlDbType.DateTime).Value = transaction.PaymentDate;
                mySqlAddTransactionCommand.Parameters.Add("@check_number", MySqlDbType.VarChar).Value = transaction.CheckNumber;
                mySqlAddTransactionCommand.Parameters.Add("@total", MySqlDbType.Decimal).Value = transaction.Total;
                mySqlAddTransactionCommand.Connection = mySqlConnection;
                mySqlAddTransactionCommand.ExecuteNonQuery();

                for (int i = 0; i < transaction.InvoiceData.Count; i++)
                {
                    InvoiceData currentInvoiceData = transaction.InvoiceData[i];
                    try
                    {
                        mySqlAddInvoiceDataCommand = new MySqlCommand($"INSERT INTO {AppSettings.INVOICE_DATA_TABLE} ({AppSettings.ADD_INVOICE_DATA_COLUMNS}) VALUES (@invoice_id, @type, @ticket_number, @total)", mySqlConnection);
                        mySqlAddInvoiceDataCommand.Parameters.Add("@invoice_id", MySqlDbType.Int32).Value = mySqlAddTransactionCommand.LastInsertedId;
                        mySqlAddInvoiceDataCommand.Parameters.Add("@type", MySqlDbType.VarChar).Value = currentInvoiceData.Type;
                        mySqlAddInvoiceDataCommand.Parameters.Add("@ticket_number", MySqlDbType.VarChar).Value = currentInvoiceData.TicketNumber;
                        mySqlAddInvoiceDataCommand.Parameters.Add("@total", MySqlDbType.Decimal).Value = currentInvoiceData.Total;
                        mySqlAddInvoiceDataCommand.ExecuteNonQuery();
                    }
                    catch
                    {
                        invoiceDataFails++;
                        invoiceDataNotAdded.Add(transaction.InvoiceData[i]);
                    }
                }
                isSuccessful = true;
                result = ENUSStrings.InvoiceAddedSuccessMessage;
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
            if (invoiceDataFails > 0)
            {
                result = TransactionServicesErrors.ConstructInvoiceDataErrors(invoiceDataNotAdded);
                isSuccessful = false;
            }
            return new CommonServiceRequest(isSuccessful, result);
        }
        internal static CommonServiceRequest EditTransaction(Transaction transaction)
        {
            bool isSuccessful = true;
            string result = string.Empty;
            mySqlConnection.Open();
            MySqlCommand mySqlAddTransactionCommand;
            MySqlCommand mySqlDeleteInvoiceDataCommand;
            MySqlCommand mySqlAddInvoiceDataCommand;
            int invoiceDataFails = 0;
            List<InvoiceData> invoiceDataNotAdded = new List<InvoiceData>();
            mySqlAddTransactionCommand = new MySqlCommand($"UPDATE {AppSettings.TRANSACTIONS_TABLE} SET type = @type, customer_id = @customer_id, created_date = @created_date, due_date = @due_date, payment_date = @payment_date, check_number = @check_number, total = @total WHERE id = @id", mySqlConnection);
            try
            {
                mySqlAddTransactionCommand.Parameters.Add("@type", MySqlDbType.VarChar).Value = transaction.Type;
                mySqlAddTransactionCommand.Parameters.Add("@customer_id", MySqlDbType.Int32).Value = transaction.CustomerID;
                mySqlAddTransactionCommand.Parameters.Add("@created_date", MySqlDbType.DateTime).Value = transaction.CreatedDate;
                mySqlAddTransactionCommand.Parameters.Add("@due_date", MySqlDbType.DateTime).Value = transaction.DueDate;
                mySqlAddTransactionCommand.Parameters.Add("@payment_date", MySqlDbType.DateTime).Value = transaction.PaymentDate;
                mySqlAddTransactionCommand.Parameters.Add("@check_number", MySqlDbType.VarChar).Value = transaction.CheckNumber;
                mySqlAddTransactionCommand.Parameters.Add("@total", MySqlDbType.Decimal).Value = transaction.Total;
                mySqlAddTransactionCommand.Parameters.Add("@id", MySqlDbType.Int32).Value = transaction.Id;
                mySqlAddTransactionCommand.Connection = mySqlConnection;
                mySqlAddTransactionCommand.ExecuteNonQuery();

                mySqlDeleteInvoiceDataCommand = new MySqlCommand($"DELETE FROM ${AppSettings.INVOICE_DATA_TABLE} WHERE invoice_id = @invoice_id", mySqlConnection);
                mySqlDeleteInvoiceDataCommand.Parameters.Add("@invoice_id", MySqlDbType.Int32).Value = transaction.Id;
                mySqlDeleteInvoiceDataCommand.ExecuteNonQuery();

                if (transaction.Type == TransactionTypes.toFriendlyString(TransactionTypesDefinitions.Invoice))
                {
                    for (int i = 0; i < transaction.InvoiceData.Count; i++)
                    {
                        InvoiceData currentInvoiceData = transaction.InvoiceData[i];
                        try
                        {
                            mySqlAddInvoiceDataCommand = new MySqlCommand($"INSERT INTO {AppSettings.INVOICE_DATA_TABLE} ({AppSettings.ADD_INVOICE_DATA_COLUMNS}) VALUES (@invoice_id, @type, @ticket_number, @total)", mySqlConnection);
                            mySqlAddInvoiceDataCommand.Parameters.Add("@invoice_id", MySqlDbType.Int32).Value = mySqlAddTransactionCommand.LastInsertedId;
                            mySqlAddInvoiceDataCommand.Parameters.Add("@type", MySqlDbType.VarChar).Value = currentInvoiceData.Type;
                            mySqlAddInvoiceDataCommand.Parameters.Add("@ticket_number", MySqlDbType.VarChar).Value = currentInvoiceData.TicketNumber;
                            mySqlAddInvoiceDataCommand.Parameters.Add("@total", MySqlDbType.Decimal).Value = currentInvoiceData.Total;
                            mySqlAddInvoiceDataCommand.ExecuteNonQuery();
                        }
                        catch
                        {
                            invoiceDataFails++;
                            invoiceDataNotAdded.Add(transaction.InvoiceData[i]);
                        }
                    }
                }
                isSuccessful = true;
                result = ENUSStrings.InvoiceEditedSuccessMessage;
            }
            catch (Exception e)
            {
                result = "Couldn't edit the transaction for the following reason: " + e.Message;
                isSuccessful = false;
            }
            finally
            {
                mySqlConnection.Close();
            }
            if (invoiceDataFails > 0)
            {
                result = TransactionServicesErrors.ConstructInvoiceDataErrors(invoiceDataNotAdded);
                isSuccessful = false;
            }
            return new CommonServiceRequest(isSuccessful, result);
        }
    }
}
