using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using STAN.Client;

namespace checkout_api.DAL
{
    public class NatsMessageProvider : IMessagingProvider
    {
        private readonly ILogger<NatsMessageProvider> _logger;

        public NatsMessageProvider(ILogger<NatsMessageProvider> logger)
        {
            _logger = logger;
        }

        public async Task<bool> Send(string message)
        {
            var opts = StanOptions.GetDefaultOptions();
            var url = Environment.GetEnvironmentVariable("NATS_URL");
            var subject = Environment.GetEnvironmentVariable("ORDER_SUBJECT");

            if (!string.IsNullOrWhiteSpace(url))
                opts.NatsURL = url;

            try
            {
                var cf = new StanConnectionFactory();
                using (var c = cf.CreateConnection("test-cluster", "checkout-api", opts))
                {
                    var guid = await c.PublishAsync(subject, Encoding.UTF8.GetBytes(message));

                    _logger.LogInformation($"Message sent with id {guid}");
                    return !string.IsNullOrWhiteSpace(guid);
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError($"Message failed: {ex.StackTrace}");
                return false;
            }
        }
    }
}