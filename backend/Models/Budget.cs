using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Budget
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; } // 1 = Jan, 12 = Dec

        [Required]
        public int Year { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
