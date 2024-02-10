namespace Invoicer.Models.ServiceRequests
{
    public class CompaniesServiceRequest : ServiceRequest
    {
        public Company company = new Company();

        public CompaniesServiceRequest(bool isSuccessful, string result, Company company) : base(isSuccessful, result)
        {
            this.company = company;
        }

        public Company Comany
        {
            get
            {
                return company;
            }
            set
            {
                company = value;
            }
        }
    }
}
