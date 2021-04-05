using System;
using System.Threading.Tasks;
using BeetleX.Redis;
using checkout_api.Models;
using Microsoft.AspNetCore.Hosting;

namespace checkout_api.DAL
{
    public class RedisProvider : IBasketProvider
    {
        public RedisDB DB { get; private set; }

        public RedisProvider()
        {
            DB = new RedisDB(0);
            DB.DataFormater = new JsonFormater();
            DB.Host.AddWriteHost(Environment.GetEnvironmentVariable("REDIS_URL") ?? "localhost");

        }
        public async Task<Basket[]> GetBasket(string basketId)
        {
            return await DB.Get<Basket[]>(basketId);
        }

        public async Task<bool> DeleteBasket(string basketId)
        {
            return await DB.Del(basketId) > 0;
        }
    }
}