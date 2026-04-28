using backend.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public TransactionTypeEnum Type { get; set; }

        [StringLength(50)] 
        public string? Icon { get; set; }

        [StringLength(7)]
        public string? Color { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Budget { get; set; } // Default/Master Budget limit

        public bool IsDefault { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    }
}
