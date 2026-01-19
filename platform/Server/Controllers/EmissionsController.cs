using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Server.Models;
using Server.Models.Api;
using Server.Models.Constants;
using Server.Models.Database;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class EmissionsController : ControllerBase
{
    private readonly IProvider<MongoClient> _provider;
    private readonly IRoutesService _routesService;

    public EmissionsController(
        IProvider<MongoClient> provider,
        IRoutesService routesService
    )
    {
        _provider = provider;
        _routesService = routesService;
    }

    [HttpGet(Name = "GetEmissions")]
    public ActionResult<IEnumerable<Emissions>> Get([FromQuery] EmissionsGetRequest emissionsGetRequest)
    {
        try
        {
            using var client = _provider.Resolve();
            var collection = client.GetDatabase(Databases.Emissions)
                .GetCollection<WellingtonEmissions>(DatabaseTables.Emissions.Trips);

            var routesList = _routesService.Routes
                .ToList()
                .Where(routePair => routePair.Value)
                .Select(routePair => routePair.Key);

            var pipeline = new EmptyPipelineDefinition<WellingtonEmissions>()
                .Match(x => x.Date >= emissionsGetRequest.StartDate)
                .Match(x => x.Date <= emissionsGetRequest.EndDate)
                .Match(x => x.Departure >= emissionsGetRequest.StartTime)
                .Match(x => x.Departure <= emissionsGetRequest.EndTime)
                .Match(Builders<WellingtonEmissions>.Filter.In(nameof(WellingtonEmissions.Route), routesList))
                .Group(x => new { x.Date, x.EngineType },
                    x => new Emissions
                    {
                        date = x.Key.Date,
                        engine_type = x.Key.EngineType,
                        trips = x.Sum(y => 1),
                        avgSpeed = x.Average(y => Mql.Convert(y.Speed, new ConvertOptions<decimal>())),
                        avgDistance = x.Average(y => y.Distance),
                        avgTime = x.Average(y => Mql.Convert(y.Time, new ConvertOptions<decimal>())) / 60, //
                        fc = x.Sum(y => y.Fc),
                        co = x.Sum(y => y.Co),
                        hc = x.Sum(y => y.Hc),
                        pm = x.Sum(y => y.Pm),
                        nox = x.Sum(y => y.Nox),
                        co2 = x.Sum(y => y.Co2),
                        carCo2Equiv = x.Sum(y => y.CarCo2Equivalent),
                        paxKm = x.Sum(y => Mql.Convert(y.PaxKm, new ConvertOptions<double>())),
                    }
                )
                .Sort(Builders<Emissions>.Sort.Descending(x => x.date).Descending(x => x.engine_type));

            return Ok(collection
                .Aggregate<Emissions>(pipeline,
                    new AggregateOptions { AllowDiskUse = true })
                .ToList());
        }
        catch (Exception e)
        {
            return Problem(e.Message);
        }
    }
}
