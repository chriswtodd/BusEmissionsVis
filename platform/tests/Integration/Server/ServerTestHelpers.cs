using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Platform.Tests.Integration;

public static class ServerTestHelpers
{
    public static async Task<bool> RegisterNewUserOnServer(HttpClient client, string user = Constants.DefaultTestUserEmail, string password = Constants.DefaultTestUserPassword)
    {
        var response = await client.PostAsJsonAsync("/register", new { Email = user, Password = password });
        if (response.IsSuccessStatusCode)
        {
            return true;
        }
        return false;
    }

    public static async Task<IList<Cookie>?> LoginToServer(HttpClient client, string user = Constants.DefaultTestUserEmail, string password = Constants.DefaultTestUserPassword)
    {
        var response = await client.PostAsJsonAsync("/login?useCookies=true", new { Email = user, Password = password });
        Assert.IsTrue(response.IsSuccessStatusCode);
        var cookieResponse = response.Headers.TryGetValues("Set-Cookie", out var cookiesHeader);

        if (cookieResponse is false)
        {
            return null;
        }

        var cookies = cookiesHeader.Select(CreateCookie).ToList();
        return cookies;
    }

    public static async Task<HttpResponseMessage> LogoutOfServer(HttpClient client, string user = Constants.DefaultTestUserEmail)
    { 
        var response = await client.PostAsJsonAsync("/logout", new { Email = user });
        return response;
    }
    
    private static Cookie CreateCookie(string cookieString)
    {
        var properties = cookieString.Split(';', StringSplitOptions.TrimEntries);
        var name = properties[0].Split("=")[0];
        var value = properties[0].Split("=")[1];
        var path = properties[2].Replace("path=", "");
        var cookie = new Cookie(name, value, path)
        {
            Secure = properties.Contains("secure"),
            HttpOnly = properties.Contains("httponly"),
            Expires = DateTime.Parse(properties[1].Replace("expires=", ""))
        };
        return cookie;
    }
}