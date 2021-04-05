using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using checkout_api.DAL;
using System.Text.Json;

namespace checkout_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly ILogger<CheckoutController> _logger;
        private readonly IBasketProvider _basketProvider;
        private readonly IMessagingProvider _messagingProvider;

        public CheckoutController(ILogger<CheckoutController> logger, IBasketProvider basketProvider,
            IMessagingProvider messagingProvider)
        {
            _logger = logger;
            _basketProvider = basketProvider;
            _messagingProvider = messagingProvider;
        }

        [HttpPost]
        public async Task<string> Post([FromBody] string basketId)
        {
            _logger.LogInformation($"Getting basket id: {basketId}");

            //grab basket from redis
            var basket = await _basketProvider.GetBasket(basketId);

            if (basket == null)
            {
                _logger.LogInformation($"Basket not found");
                return "NOK";
            }

            _logger.LogInformation($"Got basket with {basket.Length} items");

            //put in queue
            var result = await _messagingProvider.Send(JsonSerializer.Serialize(new { basket, session = basketId }));

            if (result)
            {
                await _basketProvider.DeleteBasket(basketId);
                return "OK";
            }

            return "NOK";

        }
    }
}
