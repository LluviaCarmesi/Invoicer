using Invoicer.models;

namespace Invoicer.Models.ServiceRequests
{
    public class CompaniesServiceRequest : ServiceRequest
    {
        public Company Company { get; set; } = new Company();

        public CompaniesServiceRequest(bool isSuccessful, string result, Company company) : base(isSuccessful, result)
        {
            Company = company;
        }
    }
}
