namespace backend.DTOs
{
    public class ExpenseDto
    {
        public int TransactionId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? Source { get; set; }
        public int Method { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
    }
}
