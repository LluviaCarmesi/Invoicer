namespace Invoicer.Models
{
    public abstract class ServiceRequest
    {
        public bool IsSuccessful { get; } = false;
        public string Result { get; } = string.Empty;

        public ServiceRequest(bool isSuccessful, string result)
        {
            IsSuccessful = isSuccessful;
            Result = result;
        }
    }
}
