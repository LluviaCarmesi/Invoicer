namespace Invoicer.Models.ServiceRequests
{
    public class CompaniesCustomersTransactionsServiceRequest : ServiceRequest
    {
        public List<CompaniesCustomersTransactions> CompaniesCustomersTransactions { get; set; } = new List<CompaniesCustomersTransactions>();
        public CompaniesCustomersTransactionsServiceRequest(bool isSuccesful, string result, List<CompaniesCustomersTransactions> companiesCustomersTransactions) : base(isSuccesful, result)
        {
            CompaniesCustomersTransactions = companiesCustomersTransactions;
        }
    }
}
