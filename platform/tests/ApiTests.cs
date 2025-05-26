using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace platform.tests;

internal sealed class Route
{
    public required string _id { get; set; }
    public required bool active { get; set; }
}

internal sealed class Emissions
{
    public required string avgDistance { get; set; }
    public required string avgSpeed { get; set; }
    public required string avgTime { get; set; }
    public required string carCo2Equiv { get; set; }
    public required string co { get; set; }
    public required string co2 { get; set; }
    public required DateTime date { get; set; }
    public required string engine_type { get; set; }
    public required string fc { get; set; }
    public required string hc { get; set; }
    public required string nox { get; set; }
    public required string paxKm { get; set; }
    public required string pm { get; set; }
    public required string trips { get; set; }
}

[TestClass]
public sealed class ApiTests
{
    private const string BaseUrl = "http://localhost:5000";

    [TestMethod]
    public async Task RoutesAsync()
    {
        var client = GetHttpClient();

        var response = await client.GetAsync("/routes");

        Assert.IsTrue(response.IsSuccessStatusCode);

        var routes = response.Content.ReadFromJsonAsAsyncEnumerable<Route>()
            .ToBlockingEnumerable()
            .ToArray();
        var expectedRoutes = ApiTestsData.RoutesResponse;

        Assert.AreEqual(routes.Length, expectedRoutes.Length);
        for (var i = 0; i < routes.Length; i++)
        {
            Assert.AreEqual(routes.ElementAt(i)._id, expectedRoutes.ElementAt(i)._id);
            Assert.AreEqual(routes.ElementAt(i).active, expectedRoutes.ElementAt(i).active);
        }

        return;
    }

    // [TestMethod]
    // public void SetRoutes()
    // {
    // }

    [TestMethod]
    public async Task GetDataByDayFullFleet()
    {
        var client = GetHttpClient();

        var response = await client.GetAsync("/day/wellington/2019-01-01/2019-12-10/00:00/23");

        Assert.IsTrue(response.IsSuccessStatusCode);

        var emissionsByDay = response.Content.ReadFromJsonAsAsyncEnumerable<Emissions>()
            .ToBlockingEnumerable()
            .ToArray();

        return;
    }

    // [TestMethod]
    // public void GetDataByDayElectricFleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayElectricAndEuro6Fleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayEuro3AndEuro4AndEuro5AndEuro6Fleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayEuro6Fleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayTripsBetweenMiddayAndMidnightFullFleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayTripsBetweenMidnightAndMiddayFullFleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayTripsBetweenTenAmAndThreePmFullFleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayDaysBetween1JanAnd30JuneFullFleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayDaysBetween10AprilAnd10AugustFullFleet()
    // {
    // }

    // [TestMethod]
    // public void GetDataByDayTripsBetweenTenAmAndThreePmDaysBetween10AprilAnd10AugustEuro6AndElectricFleet()
    // {
    // }

    private static HttpClient GetHttpClient()
    {
        var client = new HttpClient();
        client.BaseAddress = new Uri(BaseUrl);
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        return client;
    }
}
