using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace platform.tests;

public sealed class Emissions
{
    public required double avgDistance { get; set; }
    public required double avgSpeed { get; set; }
    public required double avgTime { get; set; }
    public required double carCo2Equiv { get; set; }
    public required double co { get; set; }
    public required double co2 { get; set; }
    public required DateTime date { get; set; }
    public required string engine_type { get; set; }
    public required double fc { get; set; }
    public required double hc { get; set; }
    public required double nox { get; set; }
    public required double paxKm { get; set; }
    public required double pm { get; set; }
    public required int trips { get; set; }
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

        var routesDict = await response.Content.ReadFromJsonAsync<Dictionary<string, Dictionary<string, bool>>>();
        var expectedRoutes = ApiTestsData.RoutesResponse;

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
        var client = GetHttpClient();

        var routesToSet = await client.GetAsync("/routes");

        Assert.IsTrue(routesToSet.IsSuccessStatusCode);

        var response = await client.PostAsync("/set_routes", routesToSet.Content);

        return;
    }

    public static IEnumerable<object[]> TestData
    {
        get
        {
            return new[]
            {
                new object[] { "/day/wellington/2019-01-01/2019-12-10/00:00/23", ApiTestsData.GetDataByDayFullFleetResponse },
                new object[] { "/day/wellington/2019-01-01/2019-12-10/12:00/23", ApiTestsData.GetDataByDayTripsBetweenMiddayAndMidnight },
                new object[] { "/day/wellington/2019-01-01/2019-12-10/00:00/12", ApiTestsData.GetDataByDayTripsBetweenMidnightAndMidday },
                new object[] { "/day/wellington/2019-01-01/2019-06-30/00:00/23", ApiTestsData.GetDataByDayDaysBetween1JanAnd30June },
                new object[] { "/day/wellington/2019-04-10/2019-10-10/00:00/23", ApiTestsData.GetDataByDayDaysBetween10AprilAnd10August },
                new object[] { "/day/wellington/2019-04-10/2019-10-10/10:00/15", ApiTestsData.GetDataByDayTripsBetweenTenAmAndThreePmDaysBetween10AprilAnd10August }
            };
        }
    }


    [TestMethod]
    [DynamicData(nameof(TestData))]
    public async Task GetDataByDayFullFleet(string url, Emissions[] expected)
    {
        var client = GetHttpClient();

        var response = await client.GetAsync(url);

        Assert.IsTrue(response.IsSuccessStatusCode);

        var apiResponse = response.Content.ReadFromJsonAsAsyncEnumerable<Emissions>()
            .ToBlockingEnumerable()
            .ToArray();

        AssertEmissionSetIsEqual(expected, apiResponse);

        return;
    }

    private void AssertEmissionSetIsEqual(Emissions[] emissions, Emissions[] expectedEmissions)
    { 
        Assert.AreEqual(emissions.Length, expectedEmissions.Length);
        for (var i = 0; i < emissions.Length; i++)
        {
            Assert.AreEqual(emissions.ElementAt(i).avgDistance, expectedEmissions.ElementAt(i).avgDistance);
            Assert.AreEqual(emissions.ElementAt(i).avgSpeed, expectedEmissions.ElementAt(i).avgSpeed);
            Assert.AreEqual(emissions.ElementAt(i).avgTime, expectedEmissions.ElementAt(i).avgTime);
            Assert.AreEqual(emissions.ElementAt(i).carCo2Equiv, expectedEmissions.ElementAt(i).carCo2Equiv);
            Assert.AreEqual(emissions.ElementAt(i).co, expectedEmissions.ElementAt(i).co);
            Assert.AreEqual(emissions.ElementAt(i).co2, expectedEmissions.ElementAt(i).co2);
            Assert.AreEqual(emissions.ElementAt(i).date, expectedEmissions.ElementAt(i).date);
            Assert.AreEqual(emissions.ElementAt(i).engine_type, expectedEmissions.ElementAt(i).engine_type);
            Assert.AreEqual(emissions.ElementAt(i).fc, expectedEmissions.ElementAt(i).fc);
            Assert.AreEqual(emissions.ElementAt(i).hc, expectedEmissions.ElementAt(i).hc);
            Assert.AreEqual(emissions.ElementAt(i).nox, expectedEmissions.ElementAt(i).nox);
            Assert.AreEqual(emissions.ElementAt(i).paxKm, expectedEmissions.ElementAt(i).paxKm);
            Assert.AreEqual(emissions.ElementAt(i).pm, expectedEmissions.ElementAt(i).pm);
            Assert.AreEqual(emissions.ElementAt(i).trips, expectedEmissions.ElementAt(i).trips);
        }
    }

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
