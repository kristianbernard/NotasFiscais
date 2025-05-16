using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using TributoJusto.Data;
using TributoJusto.Models;

namespace TributoJusto.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UploadController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo inválido.");

            using var reader = new StreamReader(file.OpenReadStream());
            var linhas = new List<string>();
            while (!reader.EndOfStream)
                linhas.Add(await reader.ReadLineAsync());

            var notasDict = new Dictionary<string, notasFiscais>();

            foreach (var linha in linhas.Skip(1)) // pula o header
            {
                var col = linha.Split(';');

                var numeroNota = col[2];
                if (!notasDict.ContainsKey(numeroNota))
                {
                    var nota = new notasFiscais
                    {
                        Cnpj = col[0],
                        razao_social = col[1],
                        numero_nota = numeroNota,
                        data_emissao = DateTime.Parse(col[3]),
                        Itens = new List<Item>()
                    };

                    notasDict[numeroNota] = nota;
                }

                var item = new Item
                {
                    codigo_item = col[4],
                    descricao_item = col[5],
                    quantidade = int.Parse(col[6], CultureInfo.InvariantCulture),
                    valor_unitario = decimal.Parse(col[7], CultureInfo.InvariantCulture),
                    imposto_item = decimal.Parse(col[8], CultureInfo.InvariantCulture)
                };

                notasDict[numeroNota].Itens.Add(item);
            }

            _context.Notas.AddRange(notasDict.Values);
            await _context.SaveChangesAsync();

            return Ok("Upload e processamento concluído.");
        }
    }
}