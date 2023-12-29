using Invoicer.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace Invoicer.Services
{
    public static class RemainingBalancesServices
    {
        private static MySqlConnection mySqlConnection = new MySqlConnection(AppSettings.SQL_CONNECTION_STRING);
        public static IActionResult GetRemainingBalance(string companyID)
        {
            decimal remainingBalance = 0;
            try
            {
                mySqlConnection.Open();
                MySqlCommand mySqlCommand = new MySqlCommand($"SELECT {AppSettings.REMAINING_BALANCE_SELECT_COLUMNS} FROM {AppSettings.REMAINING_BALANCE_TABLE} WHERE company_id = {companyID};", mySqlConnection);
                MySqlDataReader reader = mySqlCommand.ExecuteReader();
                while (reader.Read())
                {
                    remainingBalance = reader.GetDecimal(0);
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
            return new OkObjectResult(remainingBalance);
        }

    }
}
