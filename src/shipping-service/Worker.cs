using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using STAN.Client;
using Npgsql;
using System.Text.Json;

namespace shipping_service
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;

        public Worker(ILogger<Worker> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

            var cf = new StanConnectionFactory();
            var opt = StanOptions.GetDefaultOptions();
            opt.NatsURL = Environment.GetEnvironmentVariable("NATS_URL");
            var c = cf.CreateConnection("test-cluster", "shipping-svc", opt);
            _logger.LogInformation("Connected to NATS: " + opt.NatsURL);

            var pgUser = Environment.GetEnvironmentVariable("POSTGRESQL_USER");
            var pgPwd = Environment.GetEnvironmentVariable("POSTGRESQL_PASSWORD");
            var pgServer = Environment.GetEnvironmentVariable("POSTGRESQL_SERVER");
            var pgDatabase = Environment.GetEnvironmentVariable("POSTGRESQL_DB");

            await Task.Run(() =>
            {
                try
                {
                    var opts = StanSubscriptionOptions.GetDefaultOptions();
                    //opts.AckWait = 60000;
                    opts.DurableName = "orders";

                    c.Subscribe(Environment.GetEnvironmentVariable("ORDER_COMPLETE_SUBJECT"), opts, async (obj, args) =>
                    {
                        var data = System.Text.Encoding.UTF8.GetString(args.Message.Data);

                        _logger.LogInformation($"Order received: {data}");

                        var order = JsonSerializer.Deserialize<BasketOrder>(data);
                        var connstr = $"Server={pgServer};User Id={pgUser};Password={pgPwd};Database={pgDatabase}";

                        await using var conn = new NpgsqlConnection(connstr);

                        _logger.LogInformation($"Connecting to DB: {connstr}");
                        await conn.OpenAsync();

                        // Insert some data
                        await using (var cmd = new NpgsqlCommand("Update orders set shipped = @p where id = @id", conn))
                        {
                            cmd.Parameters.AddWithValue("p", true);
                            cmd.Parameters.AddWithValue("id", order.orderId);
                            _logger.LogInformation($"Updating DB: {cmd.CommandText}");
                            await cmd.ExecuteNonQueryAsync();
                        }

                        _logger.LogInformation($"Shipping Updated for order with id: {order.orderId}");

                        await c.PublishAsync(Environment.GetEnvironmentVariable("ORDER_SHIPPED_SUBJECT"), args.Message.Data);
                    });
                }
                catch (System.Exception ex)
                {
                    _logger.LogError(ex.Message);
                    throw;
                }
            }, stoppingToken);

        }
    }
}
