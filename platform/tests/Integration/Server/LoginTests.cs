using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Platform.Tests.Integration.Server;

[TestClass]
public sealed class LoginTests
{
    private static HttpClient? _client;
    private static WebApplicationFactory<Program>? _factory;

    [ClassInitialize]
    public static async Task AssemblyInitializeAsync(TestContext _)
    {
        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();
    }

    [ClassCleanup(ClassCleanupBehavior.EndOfClass)]
    public static void AssemblyCleanup()
    {
        _factory?.Dispose();
    }

    [TestMethod]
    public async Task LoginAndLogoutOfSite()
    {
        Assert.IsNotNull(_client);

        Assert.IsTrue(await ServerTestHelpers.RegisterNewUserOnServer(_client));

        var headers = await ServerTestHelpers.LoginToServer(_client);

        Assert.IsNotNull(headers);

        var successLogoutResponse = await ServerTestHelpers.LogoutOfServer(_client);

        Assert.IsTrue(successLogoutResponse.IsSuccessStatusCode);

        var unauthorisedResponse = await ServerTestHelpers.LogoutOfServer(_client);

        Assert.IsFalse(unauthorisedResponse.IsSuccessStatusCode);
        Assert.AreEqual(HttpStatusCode.Unauthorized, unauthorisedResponse.StatusCode);
    }
}