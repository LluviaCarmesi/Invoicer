namespace Invoicer.Models.ServiceRequests
{
    public class CompaniesCustomersTransactionsListsServiceRequest : ServiceRequest
    {
        public List<CompaniesCustomersTransactionsLists> CompaniesCustomersTransactionsLists { get; set; } = new List<CompaniesCustomersTransactionsLists>();
        public CompaniesCustomersTransactionsListsServiceRequest(bool isSuccesful, string result, List<CompaniesCustomersTransactionsLists> companiesCustomersTransactionsLists) : base(isSuccesful, result)
        {
            CompaniesCustomersTransactionsLists = companiesCustomersTransactionsLists;
        }
    }
}
