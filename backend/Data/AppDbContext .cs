using Microsoft.EntityFrameworkCore;
using TributoJusto.Models;

namespace TributoJusto.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<notasFiscais> Notas { get; set; }
        public DbSet<Item> Itens { get; set; }
        public DbSet<Usuario> Usuarios { get; set; } // Para autenticação
    }
}
