using backend.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        [StringLength(500)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public TransactionTypeEnum Type { get; set; } // Income or Expense

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(100)]
        public string? Source { get; set; }

        [Required]
        public TransactionMethod Method { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public int? Id { get; set; }
        
        [ForeignKey("Id")]
        public Category? Category { get; set; }
    }
}
