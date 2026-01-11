using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Platform.Tests.Integration;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Tests.Integration.Overrides;

public class GoogleTestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string AuthenticationScheme = "Test";
    private readonly IList<Claim> _claims;

    public GoogleTestAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
        _claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, Constants.DefaultTestUserNameIdentifier),
            new Claim(ClaimTypes.Name, Constants.DefaultTestUserName),
            new Claim(ClaimTypes.Email, Constants.DefaultTestUserEmail),
            new Claim(ClaimTypes.GivenName, Constants.DefaultTestUserGivenName),
            new Claim(ClaimTypes.Surname, Constants.DefaultTestUserSurname),
            new Claim("picture", ""),
            new Claim("email_verified", "true"),
        };
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var identity = new ClaimsIdentity(_claims, AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, AuthenticationScheme);

        var result = AuthenticateResult.Success(ticket);
        return Task.FromResult(result);
    }
}