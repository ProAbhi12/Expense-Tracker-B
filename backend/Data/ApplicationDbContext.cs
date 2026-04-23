using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Category>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            var seedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Food & Drinks", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#ef4444", CreatedAt = seedDate },
                new Category { CategoryId = 2, CategoryName = "Utilities", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#06b6d4", CreatedAt = seedDate },
                new Category { CategoryId = 3, CategoryName = "Salary", Type = Models.Enums.TransactionTypeEnum.INCOME, Color = "#22c55e", CreatedAt = seedDate }
            );
        }
    }
}
