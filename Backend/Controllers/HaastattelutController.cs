using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HaastattelutController : ControllerBase
{
    private readonly DataService _data;

    public HaastattelutController(DataService data)
    {
        _data = data;
    }

    private static readonly Dictionary<string, int[]> TutkintoMap = new()
    {
        { "RACA", new[] { 8505690 } },
        { "LITO", new[] { 8516664 } },
        { "MOLEMMAT", new[] { 8505690, 8516664 } }
    };
    // GET: /api/haastattelut/tutkinnot
    [HttpGet("tutkinnot")]
    public IActionResult GetTutkinnot()
    {
        return Ok(_data.Tutkinnot);
    }

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
        double median;

        if (years.Count % 2 == 1)
            median = years[years.Count / 2];
        else
            median = (years[years.Count / 2 - 1] + years[years.Count / 2]) / 2.0;

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

}
