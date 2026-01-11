using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Server.Models.Api;
using System.Net;
using System.Net.Http.Json;
using Tests.Integration.Overrides;

namespace Platform.Tests.Integration.Server;

[TestClass]
public sealed class AuthControllerTests
{
    private static HttpClient? _client;
    private static GoogleAuthWebApplicationFactory<Program>? _factory;
    private static IConfiguration? _configuration;

    [ClassInitialize]
    public static void AssemblyInitializeAsync(TestContext _)
    {
        _configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.Development.json")
            .Build();
        _factory = new GoogleAuthWebApplicationFactory<Program>();
        _client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
        });
    }

    [ClassCleanup(ClassCleanupBehavior.EndOfClass)]
    public static void AssemblyCleanup()
    {
        _factory?.Dispose();
    }

    [TestMethod]
    public async Task GoogleAsync()
    {
        var callback = "/somestring";
        Assert.IsNotNull(_client);

        var response = await _client.GetAsync($"/api/auth/google?callback={callback}");

        Assert.AreEqual(HttpStatusCode.Found, response.StatusCode);
        var location = response.Headers.TryGetValues("Location", out var values)
            ? values.FirstOrDefault()
            : null;
        Assert.IsNotNull(location);
        Assert.AreEqual($"{_configuration?.GetSection("Urls")["BaseUrl"]}{callback}", location);
    }

    [TestMethod]
    public async Task LogoutAsync()
    {
        var callback = "/somestring";
        Assert.IsNotNull(_client);

        var response = await _client.GetAsync($"/api/auth/logout?callback={callback}");

        Assert.AreEqual(HttpStatusCode.Found, response.StatusCode);
        var location = response.Headers.TryGetValues("Location", out var values)
            ? values.FirstOrDefault()
            : null;
        Assert.IsNotNull(location);
        Assert.AreEqual($"{_configuration?.GetSection("Urls")["BaseUrl"]}{callback}", location);
    }

    [TestMethod]
    public async Task UserInfoAsync()
    {
        Assert.IsNotNull(_client);

        var response = await _client.GetAsync($"/api/auth/userInfo");

        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        var userInfo = await response.Content.ReadFromJsonAsync<AuthGoogleUserInfoResponse>();
        Assert.IsNotNull(userInfo);

        Assert.AreEqual(Constants.DefaultTestUserNameIdentifier, userInfo.NameIdentifier);
        Assert.AreEqual(Constants.DefaultTestUserName, userInfo.Name);
        Assert.AreEqual(Constants.DefaultTestUserEmail, userInfo.Email);
        Assert.IsTrue(userInfo.EmailVerified);
        Assert.AreEqual(Constants.DefaultTestUserGivenName, userInfo.GivenName);
        Assert.AreEqual(Constants.DefaultTestUserSurname, userInfo.Surname);
        Assert.AreEqual("", userInfo.Picture);
    }

    [TestMethod]
    public async Task WhoAsync()
    {
        Assert.IsNotNull(_client);

        var response = await _client.GetAsync($"/api/auth/who");

        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        var who = await response.Content.ReadFromJsonAsync<WhoGetResponse>();
        Assert.IsNotNull(who);

        Assert.IsTrue(who.IsAuthenticated);
        Assert.AreEqual(Constants.DefaultTestUserName, who.Username);
    }
}
