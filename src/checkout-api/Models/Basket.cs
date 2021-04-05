namespace checkout_api.Models
{
    public class Basket
    {
        public int movieId { get; set; }
        public int quantity { get; set; }
        public string posterPath { get; set; }
        public string title { get; set; }
        public int date { get; set; }
    }
}