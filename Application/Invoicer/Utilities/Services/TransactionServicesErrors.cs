using Invoicer.Models;

namespace Invoicer.Utilities.NewFolder
{
    public class TransactionServicesErrors
    {
        public static string ConstructInvoiceDataErrors(List<InvoiceData> invoiceDataNotAdded)
        {
            string error = invoiceDataNotAdded.Count + " invoice data couldn't be added. They are below";
            for (int i = 0; i < invoiceDataNotAdded.Count; i++)
            {
                InvoiceData currentInvoiceData = invoiceDataNotAdded[i];
                error += "Type: " + currentInvoiceData.Type + ", Ticket Number: " + currentInvoiceData.TicketNumber + ", Total: " + currentInvoiceData.Total + "\n";
            }
            return error;
        }
    }
}
