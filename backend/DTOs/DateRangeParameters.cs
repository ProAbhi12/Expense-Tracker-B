using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class DateRangeParameters
    {
        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public string? SearchTerm { get; set; }
    }
}
