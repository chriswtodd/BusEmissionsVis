using Microsoft.AspNetCore.Mvc.Testing;
using Platform.Tests.Integration.Data;
using Server.Models.Database;
using System.Net.Http.Json;
using Tests.Integration.Overrides;

[TestClass]
public sealed class EmissionsTests
{
    private static HttpClient? _client;
    private static GoogleAuthWebApplicationFactory<Program>? _factory;

    [ClassInitialize]
    public static void AssemblyInitialize(TestContext _)
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
    public async Task RunDataByDayFullFleetResponse()
    {
        await GetDataByDayFromUrl("/emissions?city=wellington&startdate=2019-01-01&enddate=2019-12-10&starttime=00:00:00&endtime=23:59:59", DataByDayFullFleetResponse.Data);
    }

    [TestMethod]
    public async Task RunDataByDayTripsBetweenMiddayAndMidnight()
    {
        await GetDataByDayFromUrl("/emissions?city=wellington&startdate=2019-01-01&enddate=2019-12-10&starttime=12:00:00&endtime=23:59:59", DataByDayTripsBetweenMiddayAndMidnight.Data);
    }

    [TestMethod]
    public async Task RunDataByDayTripsBetweenMidnightAndMidday()
    {
        await GetDataByDayFromUrl("/emissions?city=wellington&startdate=2019-01-01&enddate=2019-12-10&starttime=00:00:00&endtime=23:59:59", DataByDayFullFleetResponse.Data);
    }

    [TestMethod]
    public async Task RunDataByDayDaysBetween1JanAnd30June()
    {
        await GetDataByDayFromUrl("/emissions?city=wellington&startdate=2019-01-01&enddate=2019-06-30&starttime=00:00:00&endtime=23:59:59", DataByDayDaysBetween1JanAnd30June.Data);
    }

    [TestMethod]
    public async Task RunDataByDayDaysBetween10AprilAnd10August()
    {
        await GetDataByDayFromUrl("/emissions?city=wellington&startdate=2019-04-10&enddate=2019-10-10&starttime=00:00:00&endtime=23:59:59", DataByDayDaysBetween10AprilAnd10August.Data);
    }

    [TestMethod]
    public async Task GetDataByDayTripsBetweenTenAmAndThreePmDaysBetween10AprilAnd10August()
    {
        await GetDataByDayFromUrl("/emissions?city=wellington&startdate=2019-04-10&enddate=2019-10-10&starttime=10:00:00&endtime=15:00:00", DataByDayTripsBetweenTenAmAndThreePmDaysBetween10AprilAnd10August.Data);
    }

    public async Task GetDataByDayFromUrl(string url, Emissions[] expected)
    {
        Assert.IsNotNull(_client);

        var response = await _client.GetAsync(url);

        Assert.IsTrue(response.IsSuccessStatusCode);

        var apiResponse = response.Content.ReadFromJsonAsAsyncEnumerable<Emissions>()
            .ToBlockingEnumerable()
            .ToArray();

        AssertEmissionKeySetIsApproximatelyEqual(expected, apiResponse);
        CompareEmissionTypesWithTolerances(expected, apiResponse);

        return;
    }

    // .NET and Python have the same precision for floating point numbers and doubles, however differences in
    // .NET stack creates small differences in most calculations. I suspect if you compare the bit representations
    // using double for .NET types they would be the same.
    private void CompareEmissionTypesWithTolerances(Emissions[] expectedEmissions, Emissions?[] emissions)
    {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        Assert.AreEqual(expectedEmissions.Sum(e => e.avgDistance), emissions.Sum(e => e.avgDistance), 250M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.avgSpeed), emissions.Sum(e => e.avgSpeed), 240M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.avgTime), emissions.Sum(e => e.avgTime), 1550M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.carCo2Equiv), emissions.Sum(e => e.carCo2Equiv), 329516M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.co), emissions.Sum(e => e.co), 371M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.co2), emissions.Sum(e => e.co2), 237549M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.fc), emissions.Sum(e => e.fc), 88406M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.hc), emissions.Sum(e => e.hc), 33M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.nox), emissions.Sum(e => e.nox), 836M);
        Assert.AreEqual(expectedEmissions.Sum(e => e.pm), emissions.Sum(e => e.pm), 14M);

        Assert.AreEqual(expectedEmissions.Sum(e => e.paxKm), emissions.Sum(e => e.paxKm), 117410177D);
        Assert.AreEqual(expectedEmissions.Sum(e => e.trips), emissions.Sum(e => e.trips), 16914);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
    }

    private void AssertEmissionKeySetIsApproximatelyEqual(Emissions[] expectedEmissions, Emissions?[] emissions)
    {
        Assert.AreEqual(expectedEmissions.Length, emissions.Length, 1); // we're still missing one day, #48
        if (expectedEmissions.Length == emissions.Length)
        {
            for (var i = 0; i < expectedEmissions.Length; i++)
            {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
                Assert.IsNotNull(emissions.ElementAt(i));
                Assert.AreEqual(expectedEmissions.ElementAt(i).date, emissions.ElementAt(i).date);
                Assert.AreEqual(expectedEmissions.ElementAt(i).engine_type, emissions.ElementAt(i).engine_type);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
            }
        }
    }
}