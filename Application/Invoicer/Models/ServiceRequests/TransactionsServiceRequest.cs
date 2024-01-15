namespace Invoicer.Models.ServiceRequests
{
    public class TransactionsServiceRequest : ServiceRequest
    {
        private Transaction transaction = new Transaction();
        public TransactionsServiceRequest(bool isSuccessful, string result, Transaction transaction) : base(isSuccessful, result)
        {
            Transaction = transaction;
        }
        public Transaction Transaction
        {
            get
            {
                return transaction;
            }
            set
            {
                transaction = value;
            }
        }
    }
}
