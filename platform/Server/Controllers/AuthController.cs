using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Common;
using Server.Models.Api;
using Server.Models.Mappers;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [Authorize]
    [HttpGet("google")]
    public IActionResult Google([FromQuery] AuthGoogleRequest request)
    {
        try
        {
            return Redirect(request.CreateRedirectUrl(_configuration.GetSection("Urls")["BaseUrl"]));
        }
        catch
        {
            return Problem();
        }
    }

    /// <summary>
    /// Logout action.
    /// Does nothing if the user is not logged in.
    /// </summary>
    [HttpGet("logout")]
    public async Task<IActionResult> Logout([FromQuery] AuthLogoutRequest request)
    {
        if (User.Identity.IsAuthenticated)
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect(request.CreateRedirectUrl(_configuration.GetSection("Urls")["BaseUrl"]));
        }
        return Ok();
    }

    /// <summary>
    /// Retrieves user information.
    /// </summary>
    [Authorize]
    [HttpGet("userInfo")]
    public IActionResult UserInfo()
    {

        var claimsList = new UserClaimsToAuthGoogleUserInfoResponseMapper()
            .Map(User);

        return Ok(claimsList);
    }

    /// <summary>
    /// Logout action.
    /// </summary>
    [HttpGet("who")]
    public IActionResult Who()
    {
        var response = new WhoGetResponse
        {
            IsAuthenticated = User != null ? User.Identity.IsAuthenticated : false,
            Username = User?.Identity?.Name
        };

        return Ok(response);
    }
}
