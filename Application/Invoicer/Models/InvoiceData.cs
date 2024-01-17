namespace Invoicer.Models
{
    public class InvoiceData
    {
        private int id = 0;
        private int invoiceID = 0;
        private string type = string.Empty;
        private string ticketNumber = string.Empty;
        private decimal total = new Decimal(0);

        public InvoiceData()
        {

        }
        public InvoiceData(int invoiceID, string type, string ticketNumber, decimal total)
        {
            this.invoiceID = invoiceID;
            this.type = type;
            this.ticketNumber = ticketNumber;
            this.total = total;
        }
        public InvoiceData(int id, int invoiceID, string type, string ticketNumber, decimal total)
        {
            this.id = id;
            this.invoiceID = invoiceID;
            this.type = type;
            this.ticketNumber = ticketNumber;
            this.total = total;
        }

        public int Id
        {
            get
            {
                return id;
            }
            set
            {
                id = value;
            }
        }
        public int InvoiceID
        {
            get
            {
                return invoiceID;
            }
            set
            {
                invoiceID = value;
            }
        }
        public string Type
        {
            get
            {
                return type;
            }
            set
            {
                type = value;
            }
        }
        public string TicketNumber
        {
            get
            {
                return ticketNumber;
            }
            set
            {
                ticketNumber = value;
            }
        }
        public decimal Total
        {
            get
            {
                return total;
            }
            set
            {
                total = value;
            }
        }
    }
}
