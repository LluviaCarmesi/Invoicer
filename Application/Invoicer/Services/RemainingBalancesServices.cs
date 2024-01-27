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

            return new OkObjectResult(remainingBalance);
        }

    }
}
