namespace Invoicer.Models.ServiceRequests
{
    public class TransactionsServiceRequest : ServiceRequest
    {
        public Transaction Transaction { get; set; } = new Transaction();
        public TransactionsServiceRequest(bool isSuccessful, string result, Transaction transaction) : base(isSuccessful, result)
        {
            Transaction = transaction;
        }
    }
}
