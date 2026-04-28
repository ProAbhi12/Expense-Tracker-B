using backend.Models.Enums;

namespace backend.DTOs
{
    public class AddTransactionDto
    {
        public int Id { get; set; } 
        public string Name { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public TransactionTypeEnum Type { get; set; } 
        public int CategoryId { get; set; }
        public string? Source { get; set; }
        public TransactionMethod Method { get; set; } 
        public DateTime Date { get; set; }
    }
}
