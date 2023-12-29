namespace Invoicer.Models
{
    public class Transaction
    {
        public int Id { get; set; } = 0;
        public string Type { get; set; } = "";
        public DateTime CreatedDate { get; set; } = new DateTime();
        public DateTime DuePaymentDate { get; set; } = new DateTime();
        public string CheckNumber { get; set; } = string.Empty;
        public decimal Total { get; set; } = 0;

        public Transaction(int id, string type, DateTime createdDate, DateTime duePaymentDate, string checkNumber, decimal total)
        {
            Id = id;
            Type = type;
            CreatedDate = createdDate;
            DuePaymentDate = duePaymentDate;
            CheckNumber = checkNumber;
            Total = total;
        }
        public Transaction(string type, DateTime createdDate, DateTime duePaymentDate, string checkNumber, decimal total)
        {
            Type = type;
            CreatedDate = createdDate;
            DuePaymentDate = duePaymentDate;
            CheckNumber = checkNumber;
            Total = total;
        }
        public Transaction()
        {

        }
    }
}
