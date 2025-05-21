using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenAI_API;
using TributoJusto.Data;
using System.Net.Http;
using System.Text.Json;
using System.Text;


namespace TributoJusto.Controllers
{
    
    [ApiController]
    [Route("relatorio")]
    public class RelatorioController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public RelatorioController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _httpClient = HttpClientFactory.Create();
        }

        [HttpGet]
        public IActionResult GetRelatorio(string? cnpj = null)
        {
            var query = _context.Notas.Include(n => n.Itens).AsQueryable();

            if (!string.IsNullOrEmpty(cnpj))
            {
                query = query.Where(n => n.Cnpj == cnpj);
            }

            var relatorio = query
                .GroupBy(n => n.Cnpj)
                .Select(g => new
                {
                    Cnpj = g.Key,
                    TotalImpostos = g.Sum(n => n.Itens.Sum(i => i.imposto_item)),
                    MediaDiferenca = g.Average(n =>
                        Math.Abs(n.Itens.Sum(i => i.quantidade * i.valor_unitario) - n.Itens.Sum(i => i.imposto_item)))
                })
                .ToList();

            return Ok(relatorio);
        }


        [HttpGet("/alertas")]
        public IActionResult GetAlertas()
        {
            var alertas = _context.Notas
                .Include(n => n.Itens)
                .Where(n =>
                    Math.Abs(n.Itens.Sum(i => i.quantidade * i.valor_unitario) - n.Itens.Sum(i => i.imposto_item)) > 50)
                .Select(n => new
                {
                    n.numero_nota,
                    n.Cnpj,
                    ValorTotal = n.Itens.Sum(i => i.quantidade * i.valor_unitario),
                    ImpostoTotal = n.Itens.Sum(i => i.imposto_item),
                    Diferenca = Math.Abs(n.Itens.Sum(i => i.quantidade * i.valor_unitario) - n.Itens.Sum(i => i.imposto_item))
                })
                .ToList();

            return Ok(alertas);
        }

         

        [HttpGet("/estatisticas")]
        public IActionResult GetEstatisticas()
        {
            var totalNotas = _context.Notas.Count();
            var totalItens = _context.Itens.Count();
            var valorTotal = _context.Itens.Sum(i => i.quantidade * i.valor_unitario);
            var impostoTotal = _context.Itens.Sum(i => i.imposto_item);
            var mediaImposto = _context.Itens.Average(i => i.imposto_item);

            return Ok(new
            {
                TotalNotas = totalNotas,
                TotalItens = totalItens,
                ValorTotal = valorTotal,
                ImpostoTotal = impostoTotal,
                MediaImpostoItem = mediaImposto
            });
        }



        [HttpPost("interpretar")]
        public async Task<IActionResult> InterpretarRelatorio([FromBody] PerguntaRequest request)
        {
            // Buscar todas as notas com os itens no banco e processar depois
            var notas = await _context.Notas
                .Include(n => n.Itens)
                .ToListAsync();

            // Agrupar e processar os dados em memória (evita erros de cast do EF)
            var dadosPorCnpjRaw = notas
                .GroupBy(n => n.Cnpj)
                .Select(g => new
                {
                    Cnpj = g.Key,
                    TotalNotas = g.Count(),
                    Itens = g.SelectMany(n => n.Itens).ToList()
                })
                .ToList();

            // Processar os dados com conversão decimal correta
            var dadosPorCnpj = dadosPorCnpjRaw.Select(g => new
            {
                g.Cnpj,
                g.TotalNotas,
                ValorTotal = g.Itens.Sum(i => Convert.ToDecimal(i.quantidade) * Convert.ToDecimal(i.valor_unitario)),
                ImpostoTotal = g.Itens.Sum(i => Convert.ToDecimal(i.imposto_item)),
                Itens = g.Itens.Select(i => new
                {
                    i.descricao_item,
                    Quantidade = Convert.ToDecimal(i.quantidade),
                    ValorUnitario = Convert.ToDecimal(i.valor_unitario),
                    Imposto = Convert.ToDecimal(i.imposto_item)
                }).ToList()
            }).ToList();

            // Resumo geral
            var resumo = new
            {
                TotalNotas = dadosPorCnpj.Sum(c => c.TotalNotas),
                TotalItens = dadosPorCnpj.Sum(c => c.Itens.Count),
                ValorTotal = dadosPorCnpj.Sum(c => c.ValorTotal),
                ImpostoTotal = dadosPorCnpj.Sum(c => c.ImpostoTotal)
            };

            // Montar prompt para IA
            var promptBuilder = new StringBuilder();
            promptBuilder.AppendLine($"Resumo geral: Total Notas: {resumo.TotalNotas}, Total Itens: {resumo.TotalItens}, Valor Total: {resumo.ValorTotal:n2}, Imposto Total: {resumo.ImpostoTotal:n2}.");
            promptBuilder.AppendLine("Dados detalhados por CNPJ:");
            foreach (var cnpjData in dadosPorCnpj)
            {
                promptBuilder.AppendLine($"CNPJ: {cnpjData.Cnpj}, Total Notas: {cnpjData.TotalNotas}, Valor Total: {cnpjData.ValorTotal:n2}, Imposto Total: {cnpjData.ImpostoTotal:n2}");
                promptBuilder.AppendLine("Itens:");
                foreach (var item in cnpjData.Itens)
                {
                    promptBuilder.AppendLine($" - Descrição: {item.descricao_item}, Quantidade: {item.Quantidade}, Valor Unitário: {item.ValorUnitario:n2}, Imposto: {item.Imposto:n2}");
                }
            }
            promptBuilder.AppendLine($"Pergunta do usuário: {request.Pergunta}");

            var prompt = promptBuilder.ToString();

            // Preparar chamada para Azure OpenAI
            var endpoint = _config["AzureOpenAI:Endpoint"];
            var apiKey = _config["AzureOpenAI:ApiKey"];
            var deploymentName = _config["AzureOpenAI:DeploymentName"];

            var url = $"{endpoint}openai/deployments/{deploymentName}/chat/completions?api-version=2023-03-15-preview";

            var requestBody = new
            {
                messages = new[]
                {
            new { role = "system", content = "Você é um analista fiscal que escreve resumos objetivos de dados fiscais." },
            new { role = "user", content = prompt }
        }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("api-key", apiKey);

            var response = await _httpClient.PostAsync(url, httpContent);
            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

            var responseContent = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseContent);
            var chatResponse = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return Ok(new
            {
                Resumo = resumo,
                Interpretacao = chatResponse
            });
        }

        // Modelo para receber a pergunta no POST
        public class PerguntaRequest
        {
            public string Pergunta { get; set; }
        }




    }
}
