namespace Invoicer.Models
{
    public class TransactionsWithBalance
    {
        private List<Transaction> transactions = new List<Transaction>();
        private decimal remainingBalance = 0;

        public TransactionsWithBalance() { }

        public TransactionsWithBalance(List<Transaction> transactions, decimal remainingBalance)
        {
            this.transactions = transactions;
            this.remainingBalance = remainingBalance;
        }

        public List<Transaction> Transactions
        {
            get
            {
                return transactions;
            }
            set
            {
                transactions = value;
            }
        }

        public decimal RemainingBalance
        {
            get
            {
                return remainingBalance;
            }
            set
            {
                remainingBalance = value;
            }
        }
    }
}
