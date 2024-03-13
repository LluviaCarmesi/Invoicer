namespace Invoicer.Models
{
    public class CompaniesCustomersTransactionsLists
    {
        public List<Company> Companies { get; set; } = new List<Company>();
        public List<Customer> Customers { get; set; } = new List<Customer>();
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
        public List<InvoiceData> InvoiceDatas { get; set; } = new List<InvoiceData>();
        public CompaniesCustomersTransactionsLists(
            List<Company> companies, List<Customer> customers,
            List<Transaction> transactions, List<InvoiceData> invoiceDatas
            )
        {
            Companies = companies;
            Customers = customers;
            Transactions = transactions;
            InvoiceDatas = invoiceDatas;
        }
    }
}
