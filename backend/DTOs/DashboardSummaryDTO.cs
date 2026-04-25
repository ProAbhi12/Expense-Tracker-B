namespace backend.DTOs
{
    public class DashboardSummaryDTO
    {
        public decimal TotalBalance { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public int TransactionCount { get; set; }
    }
}
