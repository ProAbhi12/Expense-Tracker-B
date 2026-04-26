namespace backend.DTOs
{
    public class CategoryDto
    {
        public string Name { get; set; }
        public int Type { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public decimal Budget { get; set; }
        public bool IsDefault { get; set; }
    }
}