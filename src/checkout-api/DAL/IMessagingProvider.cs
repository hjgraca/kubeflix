using System.Threading.Tasks;

namespace checkout_api.DAL
{
    public interface IMessagingProvider
    {
        public Task<bool> Send(string message);
    }
}