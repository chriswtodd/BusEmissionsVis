using System.Security.Claims;
using Server.Models.Api;

namespace Server.Models.Mappers;

public class UserClaimsToAuthGoogleUserInfoResponseMapper
{
    public AuthGoogleUserInfoResponse Map(ClaimsPrincipal origin)
    {
        var destination = new AuthGoogleUserInfoResponse();

        if (origin == default)
        {
            return destination;
        }

        destination.NameIdentifier = origin.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        destination.Name = origin.FindFirst(ClaimTypes.Name)?.Value;
        destination.Email = origin.FindFirst(ClaimTypes.Email)?.Value;
        destination.EmailVerified = origin.FindFirstValue("email_verified") == "true";
        destination.GivenName = origin.FindFirstValue(ClaimTypes.GivenName);
        destination.Surname = origin.FindFirstValue(ClaimTypes.Surname);
        destination.Picture = origin.FindFirstValue("picture");

        return destination;
    }
}