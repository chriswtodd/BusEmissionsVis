using Microsoft.AspNetCore.Mvc.Testing;
using Server.Models.Api;
using System.Net.Http.Json;
using Tests.Integration.Overrides;

namespace Platform.Tests.Integration.Server;

[TestClass]
public sealed class RouteTests
{
    private static HttpClient? _client;
    private static GoogleAuthWebApplicationFactory<Program>? _factory;

    [ClassInitialize]
    public static async Task AssemblyInitializeAsync(TestContext _)
    {
        _factory = new GoogleAuthWebApplicationFactory<Program>();
        _client = _factory.CreateClient();
    }

    [ClassCleanup(ClassCleanupBehavior.EndOfClass)]
    public static void AssemblyCleanup()
    {
        _factory?.Dispose();
    }

    [TestMethod]
    public async Task RoutesAsync()
    {
        Assert.IsNotNull(_client);

        var response = await _client.GetAsync("/routes");

        Assert.IsTrue(response.IsSuccessStatusCode);
        var routesResponse = await response.Content.ReadFromJsonAsync<RoutesGetResponse>();
        Assert.IsNotNull(routesResponse);

        var expectedRoutes = RoutesTestData.Data;
        var routes = routesResponse.Routes;

        Assert.AreEqual(routes.Keys.Count(), expectedRoutes.Keys.Count());
        for (var i = 0; i < routes.Keys.Count(); i++)
        {
            Assert.AreEqual(routes.Keys.ElementAt(i), expectedRoutes.Keys.ElementAt(i));
            Assert.AreEqual(routes.Values.ElementAt(i), expectedRoutes.Values.ElementAt(i));
        }
    }

    [TestMethod]
    public async Task SetRoutes()
    {
        Assert.IsNotNull(_client);

        var routesGetResponse = await _client.GetAsync("/routes");

        Assert.IsTrue(routesGetResponse.IsSuccessStatusCode);
        var routesToSet = await routesGetResponse
            .Content
            .ReadFromJsonAsync<RoutesGetResponse>();
        Assert.IsNotNull(routesToSet);

        routesToSet.Routes["1"] = false;
        routesToSet.Routes["2"] = false;
        routesToSet.Routes["3"] = false;
        routesToSet.Routes["7"] = false;
        var routesPutResponse = await _client.PutAsJsonAsync("/routes", routesToSet);

        Assert.IsTrue(routesPutResponse.IsSuccessStatusCode);

        var routesGetResponseAfterUpdate = await _client.GetAsync("/routes");

        Assert.IsTrue(routesGetResponseAfterUpdate.IsSuccessStatusCode);
        var routesAfterUpdate = await routesGetResponseAfterUpdate
            .Content
            .ReadFromJsonAsync<RoutesGetResponse>();
        Assert.IsNotNull(routesAfterUpdate);

        Assert.AreEqual(routesAfterUpdate.Routes.Count(), routesToSet.Routes.Count());
        for (var i = 0; i < routesToSet.Routes.Count(); i++)
        {
            Assert.AreEqual(routesToSet.Routes.ElementAt(i), routesAfterUpdate.Routes.ElementAt(i));
        }
    }
}
