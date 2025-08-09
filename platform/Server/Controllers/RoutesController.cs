using Microsoft.AspNetCore.Mvc;
using Server.Models.Api;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class RoutesController : ControllerBase
{
    private readonly ILogger<RoutesController> _logger;
    private readonly IRoutesService _routesService;

    public RoutesController(
        ILogger<RoutesController> logger,
        IRoutesService routesService
    )
    {
        _logger = logger;
        _routesService = routesService;
    }

    [HttpGet(Name = "GetRoutes")]
    public ActionResult<IDictionary<string, IDictionary<string, bool>>> Get()
    {
        try
        {
            return Ok(new Dictionary<string, IDictionary<string, bool>>
            {
                { "routes", _routesService.Routes }
            });
        }
        catch
        {
            // log
            // _logger.Log(e);
            return Problem();
        }
    }

    [HttpPut(Name = "SetRoutes")]
    public IActionResult Put(RoutesPutRequest routesPostRequest)
    {
        _routesService.Routes = routesPostRequest.Routes;

        return NoContent();
    }
}
