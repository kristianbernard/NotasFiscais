using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TributoJusto.Models
{
    [Table("tbl_notas_fiscais")]
    public class notasFiscais
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public required string Cnpj { get; set; }
        public required string razao_social { get; set; }
        public required string numero_nota { get; set; }
        public DateTime data_emissao { get; set; }

        public required List<Item> Itens { get; set; }
    }
}
