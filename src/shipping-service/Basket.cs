namespace shipping_service
{
    public class BasketOrder
    {
        public string session { get; set; }
        public BasketOrderItem Basket { get; set; }
        public int orderId { get; set; }
    }

    public class BasketOrderItem
    {
        public int movieId { get; set; }
        public string title { get; set; }
    }
}