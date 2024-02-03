namespace Invoicer.Models.ServiceRequests
{
    public class CustomersServiceRequest : ServiceRequest
    {
        public Customer customer = new Customer();

        public CustomersServiceRequest(bool isSuccessful, string result, Customer customer) : base(isSuccessful, result)
        {
            this.customer = customer;
        }

        public Customer Customer
        {
            get
            {
                return customer;
            }
            set
            {
                customer = value;
            }
        }
    }
}
