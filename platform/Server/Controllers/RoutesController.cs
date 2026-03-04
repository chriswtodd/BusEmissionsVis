using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Models.Api;
using Server.Services;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
    public ActionResult<RoutesGetResponse> Get()
    {
        try
        {
            return Ok(new RoutesGetResponse
            {
                Routes = _routesService.Routes
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
