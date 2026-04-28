public class AddTransactionDto
{
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Method { get; set; }   // frontend sends number
    public string? Source { get; set; }
    public DateTime Date { get; set; }
    public int Id { get; set; }
}