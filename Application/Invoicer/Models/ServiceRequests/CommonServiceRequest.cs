namespace Invoicer.Models.ServiceRequests
{
    public class CommonServiceRequest: ServiceRequest
    {
        public CommonServiceRequest(bool isSuccessful, string result): base(isSuccessful, result)
        {

        }
    }
}
