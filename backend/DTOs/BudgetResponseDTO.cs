namespace backend.DTOs
{
    public class BudgetResponseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        // NEW
        public decimal Spent { get; set; }
        public decimal Remaining { get; set; }
    }
}