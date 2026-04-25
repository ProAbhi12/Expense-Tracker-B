using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class DateRangeParameters
    {
        [Required]
        public DateTime FromDate { get; set; } = DateTime.UtcNow.AddMonths(-1);

        [Required]
        public DateTime ToDate { get; set; } = DateTime.UtcNow;

        public string? SearchTerm { get; set; } 
    }
}
