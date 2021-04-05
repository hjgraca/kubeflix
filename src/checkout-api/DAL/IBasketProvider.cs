using System.Threading.Tasks;
using checkout_api.Models;

namespace checkout_api.DAL
{
    public interface IBasketProvider
    {
        public Task<Basket[]> GetBasket(string basketId);
        public Task<bool> DeleteBasket(string basketId);
    }

}