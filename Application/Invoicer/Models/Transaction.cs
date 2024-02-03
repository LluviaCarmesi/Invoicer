﻿namespace Invoicer.Models
{
    public class Transaction
    {
        public int Id { get; set; } = 0;
        public int CustomerID { get; set; } = 0;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = new DateTime();
        public DateTime DueDate { get; set; } = new DateTime();
        public DateTime PaymentDate { get; set; } = new DateTime();
        public string CheckNumber { get; set; } = string.Empty;
        public decimal Total { get; set; } = 0;
        public List<InvoiceData> InvoiceData { get; set; } = new List<InvoiceData>();

        public Transaction(int id, int customerID, string type, DateTime createdDate, DateTime dueDate, DateTime paymentDate, string checkNumber, decimal total)
        {
            Id = id;
            CustomerID = customerID;
            Type = type;
            CreatedDate = createdDate;
            DueDate = dueDate;
            PaymentDate = paymentDate;
            CheckNumber = checkNumber;
            Total = total;
        }
        public Transaction(int customerID, string type, DateTime createdDate, DateTime dueDate, DateTime paymentDate, string checkNumber, decimal total)
        {
            CustomerID = customerID;
            Type = type;
            CreatedDate = createdDate;
            DueDate = dueDate;
            PaymentDate = paymentDate;
            CheckNumber = checkNumber;
            Total = total;
        }
        public Transaction()
        {

        }
    }
}
