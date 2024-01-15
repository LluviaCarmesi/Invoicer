using Invoicer.Models;

namespace Invoicer.Models.ServiceRequests
{
    public class CompaniesServiceRequest : ServiceRequest
    {
        public Company Company = new Company();

        public CompaniesServiceRequest(bool isSuccessful, string result, Company company) : base(isSuccessful, result)
        {
            Company = company;
        }

        public Company company
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
