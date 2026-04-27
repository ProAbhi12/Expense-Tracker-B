namespace backend.DTOs
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty; 
        public string CategoryName { get; set; } = string.Empty;
        public string CategoryColor { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Method { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
