namespace Invoicer.Enums
{
    public enum TransactionTypesDefinitions
    {
        Invoice,
        Payment
    }
    public static class TransactionTypes
    {
        public static string toFriendlyString(this TransactionTypesDefinitions transactionTypesDefinitions)
        {
            switch (transactionTypesDefinitions)
            {
                case TransactionTypesDefinitions.Invoice:
                    return "invoice";
                case TransactionTypesDefinitions.Payment:
                    return "payment";
                default:
                    return "";
            }
        }
    }
}
