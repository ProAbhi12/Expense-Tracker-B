namespace backend.DTOs
{
    public class IncomeExpenseComparisonDTO
    {
        public DateTime Date { get; set; }
        public decimal Income { get; set; }
        public decimal Expense { get; set; }
    }
}
