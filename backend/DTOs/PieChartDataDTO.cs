namespace backend.DTOs
{
    public class PieChartDataDTO
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Color { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
    }
}
