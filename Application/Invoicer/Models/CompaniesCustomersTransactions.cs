namespace Invoicer.Models
{
    public class CompaniesCustomersTransactions
    {
        public int CompanyID { get; set; } = 0;
        public string CompanyName { get; set; } = string.Empty;
        public int CustomerID { get; set; } = 0;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public int Id { get; set; } = 0;
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = new DateTime();
        public DateTime DueDate { get; set; } = new DateTime();
        public DateTime PaymentDate { get; set; } = new DateTime();
        public string CheckNumber { get; set; } = string.Empty;
        public decimal Total { get; set; } = 0;
        public CompaniesCustomersTransactions() { }

        public CompaniesCustomersTransactions(
            int companyID, string companyName, int customerID, string customerName, string customerEmail, string customerPhone,
            int id, string type, DateTime createdDate, DateTime dueDate, DateTime paymentDate, decimal total
            )
        {
            CompanyID = companyID;
            CompanyName = companyName;
            CustomerID = customerID;
            CustomerName = customerName;
            CustomerEmail = customerEmail;
            CustomerPhone = customerPhone;
            Id = id;
            Type = type;
            CreatedDate = createdDate;
            DueDate = dueDate;
            PaymentDate = paymentDate;
            Total = total;
        }
    }
}
