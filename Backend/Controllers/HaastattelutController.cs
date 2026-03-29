using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Backend.Controllers;

[ApiController]
[Route("api/haastattelut")]
public class HaastattelutController : ControllerBase
{
    private readonly DataService _data;
    private readonly HttpClient _http;

    public HaastattelutController(DataService data, IHttpClientFactory httpFactory)
    {
        _data = data;
        _http = httpFactory.CreateClient();
    }

    // 🔹 Локальні ID для фільтрації інтерв’ю
    private static readonly Dictionary<string, int[]> TutkintoMap = new()
    {
        { "RACA", new[] { 8516664 } },
        { "LITO", new[] { 8505690 } },
        { "MOLEMMAT", new[] { 8505690, 8516664 } }
    };

    private static readonly Dictionary<string, int> PerusteIdMap = new()
    {
        { "RACA", 8516664 },
        { "LITO", 8505690 }
    };

    // GET: /api/haastattelut/tutkinnot
    [HttpGet("tutkinnot")]
    public IActionResult GetTutkinnot()
    {
        return Ok(_data.Tutkinnot);
    }

    // GET: /api/haastattelut/background
    [HttpGet("background")]
    public IActionResult GetBackground([FromQuery] string tutkinto, [FromQuery] int vuosi)
    {
        if (!TutkintoMap.TryGetValue(tutkinto.ToUpper(), out int[] tutkintoIds))
            return BadRequest("Tuntematon tutkinto. Käytä RACA, LITO tai MOLEMMAT.");

        var filtered = _data.Haastattelut
            .Where(h => tutkintoIds.Contains(h.tutkintoId))
            .Where(h => h.pvm.Year == vuosi)
            .ToList();

        if (!filtered.Any())
            return NotFound("Ei dataa valitulle tutkinnolle.");

        var avgPeruskoulu = filtered.Average(h => h.peruskouluVuosi ?? 0);
        var percentAmmatillinen = filtered.Count(h => h.ammatillinenVuosi != null) * 100.0 / filtered.Count;
        var percentLukio = filtered.Count(h => h.lukioVuosi != null) * 100.0 / filtered.Count;
        var percentKorkeakoulu = filtered.Count(h => h.korkeakouluVuosi != null) * 100.0 / filtered.Count;
        var avgTyokokemus = filtered.Average(h => h.tyokokemusVuosia);

        var years = filtered.Select(h => h.tyokokemusVuosia).OrderBy(x => x).ToList();
        double median = years.Count % 2 == 1
            ? years[years.Count / 2]
            : (years[years.Count / 2 - 1] + years[years.Count / 2]) / 2.0;

        var percentUlkomaan = filtered.Count(h => h.ulkomaanOpinnot) * 100.0 / filtered.Count;
        var percentMuuOsaaminen = filtered.Count(h => h.muuOsaaminen) * 100.0 / filtered.Count;

        return Ok(new
        {
            tutkinto,
            avgPeruskoulu,
            percentAmmatillinen,
            percentLukio,
            percentKorkeakoulu,
            avgTyokokemus,
            median,
            percentUlkomaan,
            percentMuuOsaaminen
        });
    }

    // GET: /api/haastattelut/competencies
    [HttpGet("competencies")]
    public async Task<IActionResult> GetCompetencies(
        [FromQuery] string tutkinto,
        [FromQuery] int vuosi,
        [FromQuery] string language = "fi")
    {
        language = language?.ToLower() ?? "fi";

        if (language == "suomi") language = "fi";
        if (language == "ruotsi") language = "sv";
        if (language == "englanti") language = "en";

        if (language != "fi" && language != "sv" && language != "en")
            language = "fi";

        if (tutkinto.Equals("Molemmat", StringComparison.OrdinalIgnoreCase))
            tutkinto = "MOLEMMAT";

        if (!TutkintoMap.TryGetValue(tutkinto.ToUpper(), out int[] tutkintoIds))
            return BadRequest("Tuntematon tutkinto. Käytä RACA, LITO tai MOLEMMAT.");

        var filtered = _data.Haastattelut
            .Where(h => tutkintoIds.Contains(h.tutkintoId))
            .Where(h => h.pvm.Year == vuosi)
            .ToList();

        var keskimTunnistettu = filtered.Average(h => (h.osatOsaamista?.Count ?? 0));
        var keskimJonkinVerran = filtered.Average(h => (h.osatJonkinVerran?.Count ?? 0));
        var keskimEiTunnistettu = filtered.Average(h => (h.osatEiTunnistettu?.Count ?? 0));


        if (!filtered.Any())
            return NotFound("Ei dataa valitulle tutkinnolle.");

        // -------------------------------------------------------
        // 1) Побудувати tutkintoId → osaId[]
        // -------------------------------------------------------
        var tutkintoToOsaMap = filtered
            .GroupBy(h => h.tutkintoId)
            .ToDictionary(
                g => g.Key,
                g => g.SelectMany(h => h.osatOsaamista ?? new List<int>())
                    .Distinct()
                    .ToList()
            );

        // -------------------------------------------------------
        // 2) Побудувати tutkintoId → perusteId (int → int)
        // -------------------------------------------------------
        var tutkintoIdToPerusteId = new Dictionary<int, int>
        {
            { 8505690, 8505690 }, // LITO
            { 8516664, 8516664 }  // RACA
        };

        // -------------------------------------------------------
        // 3) Побудувати perusteId → osaId[]
        // -------------------------------------------------------
        var PerusteOsaMap = tutkintoToOsaMap
            .Where(kvp => tutkintoIdToPerusteId.ContainsKey(kvp.Key))
            .ToDictionary(
                kvp => tutkintoIdToPerusteId[kvp.Key],
                kvp => kvp.Value
            );

        // -------------------------------------------------------
        // 4) Знайти найчастіші osaId
        // -------------------------------------------------------
        var kaikkiTunnistetutOsat = filtered
            .Where(h => h.osatOsaamista != null)
            .SelectMany(h => h.osatOsaamista)
            .ToList();

        List<int> yleisimmatOsatIds = new();
        List<string?> yleisimmatOsatNimet = new();
        List<double> yleisimmatOsatProsentit = new();

        if (kaikkiTunnistetutOsat.Any())
        {
            var grouped = kaikkiTunnistetutOsat
                .GroupBy(id => id)
                .Select(g => new { Id = g.Key, Count = g.Count() })
                .ToList();

            int maxCount = grouped.Max(g => g.Count);

            var mostCommon = grouped
                .Where(g => g.Count == maxCount)
                .Select(g => g.Id)
                .ToList();

            yleisimmatOsatIds.AddRange(mostCommon);

            // -------------------------------------------------------
            // 5) Розкласти osaId назад по perusteId
            // -------------------------------------------------------
            var perusteToMostCommon = new Dictionary<int, List<int>>();

            foreach (var kvp in PerusteOsaMap)
            {
                int perusteId = kvp.Key;
                var osaList = kvp.Value;

                var matched = mostCommon
                    .Where(id => osaList.Contains(id))
                    .ToList();

                if (matched.Any())
                    perusteToMostCommon[perusteId] = matched;
            }

            // -------------------------------------------------------
            // 6) Отримати назви з ePerusteet
            // -------------------------------------------------------
            foreach (var kvp in perusteToMostCommon)
            {
                int perusteId = kvp.Key;

                foreach (var osaId in kvp.Value)
                {
                    int totalCount = kaikkiTunnistetutOsat.Count;

                    int osaCount = grouped
                        .First(g => g.Id == osaId)
                        .Count;

                    double prosentti = osaCount * 100.0 / totalCount;
                    yleisimmatOsatProsentit.Add(prosentti);

                    var nimi = await GetOsaNameFromEPerusteet(perusteId, osaId, language);
                    yleisimmatOsatNimet.Add(nimi);
                }
            }
        }

        var prosenttiTyokokemus = filtered.Count(h => h.tunnistettuTyokokemuksella == true) * 100.0 / filtered.Count;
        var prosenttiKoulutus = filtered.Count(h => h.tunnistettuKoulutuksella == true) * 100.0 / filtered.Count;
        var prosenttiMuu = filtered.Count(h => h.tunnistettuMuulla == true) * 100.0 / filtered.Count;

        return Ok(new
        {
            tutkinto,
            vuosi,
            language,

            keskimTunnistettu,
            keskimJonkinVerran,
            keskimEiTunnistettu,

            yleisimmatOsatIds,
            yleisimmatOsatNimet,
            yleisimmatOsatProsentit,

            prosenttiTyokokemus,
            prosenttiKoulutus,
            prosenttiMuu
        });
    }

    private async Task<string?> GetOsaNameFromEPerusteet(int perusteId, int osaId, string language)
    {
        var url = $"https://eperusteet.opintopolku.fi/eperusteet-service/api/external/peruste/{perusteId}/perusteenosa/{osaId}";

        using var client = new HttpClient();
        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var root = json.RootElement;

        if (root.TryGetProperty("nimi", out var nimiProp) &&
            nimiProp.TryGetProperty(language, out var langProp))
        {
            return langProp.GetString();
        }

        return null;
    }


}