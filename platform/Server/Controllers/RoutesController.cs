using Microsoft.AspNetCore.Mvc;
using Server.Models.Api;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IRoutesService _routesService;

    public RoutesController(
        IRoutesService routesService
    )
    {
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
            return Problem();
        }
    }

    [HttpPut(Name = "UpdateRoutes")]
    public IActionResult Put(RoutesPutRequest routesPutRequest)
    {
        _routesService.Routes = routesPutRequest.Routes;

        return NoContent();
    }
}
