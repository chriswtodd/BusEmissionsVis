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

    // /emissions?city=wellington&startdate=2019-04-10&enddate=2019-10-10&starttime=10:00&endtime=15:00
    [HttpGet(Name = "GetEmissions")]
    public ActionResult<IEnumerable<Emissions>> Get([FromQuery] EmissionsGetRequest emissionsGetRequest)
    {
        try
        {
            using var client = _provider.Resolve();
            var collection = client.GetDatabase("test")
                .GetCollection<WellingtonEmissions>(DatabaseTables.Trips);

            var routesList = _routesService.Routes
                .ToList()
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
                        fc = x.Average(y => y.Fc),
                        co = x.Average(y => y.Co),
                        hc = x.Average(y => y.Hc),
                        pm = x.Average(y => y.Pm),
                        nox = x.Average(y => y.Nox),
                        co2 = x.Average(y => y.Co2),
                        carCo2Equiv = x.Average(y => y.CarCo2Equivalent),
                        paxKm = x.Average(y => Mql.Convert(y.PaxKm, new ConvertOptions<double>())),
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
            // log
            // _logger.Log(e);
            return Problem(e.Message);
        }
    }
}
