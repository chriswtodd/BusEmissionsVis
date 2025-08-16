using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;

namespace Platform.Tests.Integration.Server;

[TestClass]
public sealed class RouteTests
{
    private static WebApplicationFactory<Program>? _factory;

    [ClassInitialize]
    public static void AssemblyInitialize(TestContext _)
    {
        _factory = new WebApplicationFactory<Program>();
    }

    [ClassCleanup(ClassCleanupBehavior.EndOfClass)]
    public static void AssemblyCleanup()
    {
        _factory?.Dispose();
    }

    [TestMethod]
    public async Task RoutesAsync()
    {
        // Arrange
        var client = _factory?.CreateClient();

        Assert.IsNotNull(client);

        var response = await client.GetAsync("/routes");

        Assert.IsTrue(response.IsSuccessStatusCode);

        var routesDict = await response.Content.ReadFromJsonAsync<Dictionary<string, Dictionary<string, bool>>>();
        var expectedRoutes = RoutesTestData.Data;

        var routes = routesDict["routes"];

        Assert.AreEqual(routes.Keys.Count(), expectedRoutes.Keys.Count());
        for (var i = 0; i < routes.Keys.Count(); i++)
        {
            Assert.AreEqual(routes.Keys.ElementAt(i), expectedRoutes.Keys.ElementAt(i));
            Assert.AreEqual(routes.Values.ElementAt(i), expectedRoutes.Values.ElementAt(i));
        }

        return;
    }

    [TestMethod]
    public async Task SetRoutes()
    {
        // Arrange
        var client = _factory?.CreateClient();

        Assert.IsNotNull(client);

        var routesToSet = await client.GetAsync("/routes");

        Assert.IsTrue(routesToSet.IsSuccessStatusCode);

        var response = await client.PutAsync("/routes", routesToSet.Content);

        Assert.IsTrue(response.IsSuccessStatusCode);

        return;
    }
}
