using backend.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [StringLength(550)]
        public string? Description { get; set; }

        [Required]
        public TransactionTypeEnum Type { get; set; }

        [StringLength(10)] 
        public string? Icon { get; set; }

        [StringLength(7)]
        public string? Color { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BudgetLimit { get; set; }
        public bool IsDefault { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
