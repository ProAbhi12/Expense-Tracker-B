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
        public DbSet<Budget> Budgets { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Category)
                .WithMany(c => c.Transactions)
                .HasForeignKey(t => t.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Budget>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Budgets)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Category>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            var seedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Food & Drinks", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#ef4444", Budget = 3000, CreatedAt = seedDate, IsDefault = true },
                new Category { Id = 2, Name = "Rent & Bills", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#ef4444", Budget = 3000, CreatedAt = seedDate, IsDefault = true },
                new Category { Id = 3, Name = "Transportation", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#06b6d4", Budget = 1500, CreatedAt = seedDate, IsDefault = true },
                new Category { Id = 4, Name = "Entertainment", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#06b6d4", Budget = 1500, CreatedAt = seedDate, IsDefault = true },
                new Category { Id = 5, Name = "Salary", Type = Models.Enums.TransactionTypeEnum.INCOME, Color = "#22c55e", Budget = 50000, CreatedAt = seedDate, IsDefault = true },
                new Category { Id = 6, Name = "Shopping", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#06b6d4", Budget = 1500, CreatedAt = seedDate, IsDefault = true },
                new Category { Id = 7, Name = "Others", Type = Models.Enums.TransactionTypeEnum.EXPENSE, Color = "#06b6d4", Budget = 1500, CreatedAt = seedDate, IsDefault = true }
            );
        }
    }
}
