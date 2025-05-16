using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TributoJusto.Models
{
    [Table("tbl_itens")]
    public class Item
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public required string codigo_item { get; set; }
        public required string descricao_item { get; set; }
        public decimal quantidade { get; set; }
        public decimal valor_unitario { get; set; }
        public decimal imposto_item { get; set; }

        [ForeignKey("Nota")]
        public int notas_id { get; set; }
        public notasFiscais Nota { get; set; }
    }
}
