namespace Invoicer.Models
{
    public class Transaction
    {
        public int Id { get; set; } = 0;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = new DateTime();
        public DateTime DueDate { get; set; } = new DateTime();
        public DateTime PaymentDate { get; set; } = new DateTime();
        public string CheckNumber { get; set; } = string.Empty;
        public decimal Total { get; set; } = 0;

        public Transaction(int id, string type, DateTime createdDate, DateTime dueDate, string checkNumber, decimal total)
        {
            Id = id;
            Type = type;
            CreatedDate = createdDate;
            DueDate = dueDate;
            CheckNumber = checkNumber;
            Total = total;
        }
        public Transaction(string type, DateTime createdDate, DateTime dueDate, string checkNumber, decimal total)
        {
            Type = type;
            CreatedDate = createdDate;
            DueDate = dueDate;
            CheckNumber = checkNumber;
            Total = total;
        }
        public Transaction()
        {

        }
    }
}
