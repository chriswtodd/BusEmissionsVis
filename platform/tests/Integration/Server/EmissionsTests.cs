using Microsoft.AspNetCore.Mvc.Testing;
using Platform.Tests.Integration.Data;
using Server.Models.Database;
using System.Net.Http.Json;

[TestClass]
public sealed class EmissionsTests
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
        // Arrange
        var client = _factory?.CreateClient();

        Assert.IsNotNull(client);

        var response = await client.GetAsync(url);

        Assert.IsTrue(response.IsSuccessStatusCode);

        var apiResponse = response.Content.ReadFromJsonAsAsyncEnumerable<Emissions>()
            .ToBlockingEnumerable()
            .ToArray();

        AssertEmissionSetIsEqual(expected, apiResponse);

        return;
    }

    private void AssertEmissionSetIsEqual(Emissions[] expectedEmissions, Emissions?[] emissions)
    {
        Assert.AreEqual(expectedEmissions.Length, emissions.Length);
        for (var i = 0; i < expectedEmissions.Length; i++)
        {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            Console.WriteLine($"EmissionsType: {emissions.ElementAt(i).engine_type} Date: {emissions.ElementAt(i).date} Trips: {emissions.ElementAt(i).trips}");
            Console.WriteLine($"EmissionsType: {expectedEmissions.ElementAt(i).engine_type} Date: {expectedEmissions.ElementAt(i).date}  Trips: {emissions.ElementAt(i).trips}");
            Assert.IsNotNull(emissions.ElementAt(i));
            Assert.AreEqual(expectedEmissions.ElementAt(i).date, emissions.ElementAt(i).date);
            Assert.AreEqual(expectedEmissions.ElementAt(i).engine_type, emissions.ElementAt(i).engine_type);
            Assert.AreEqual(expectedEmissions.ElementAt(i).avgDistance, emissions.ElementAt(i).avgDistance);
            Assert.AreEqual(expectedEmissions.ElementAt(i).avgSpeed, emissions.ElementAt(i).avgSpeed);
            Assert.AreEqual(expectedEmissions.ElementAt(i).avgTime, emissions.ElementAt(i).avgTime);
            Assert.AreEqual(expectedEmissions.ElementAt(i).carCo2Equiv, emissions.ElementAt(i).carCo2Equiv);
            Assert.AreEqual(expectedEmissions.ElementAt(i).co, emissions.ElementAt(i).co);
            Assert.AreEqual(expectedEmissions.ElementAt(i).co2, emissions.ElementAt(i).co2);
            Assert.AreEqual(expectedEmissions.ElementAt(i).fc, emissions.ElementAt(i).fc);
            Assert.AreEqual(expectedEmissions.ElementAt(i).hc, emissions.ElementAt(i).hc);
            Assert.AreEqual(expectedEmissions.ElementAt(i).nox, emissions.ElementAt(i).nox);
            Assert.AreEqual(expectedEmissions.ElementAt(i).paxKm, emissions.ElementAt(i).paxKm);
            Assert.AreEqual(expectedEmissions.ElementAt(i).pm, emissions.ElementAt(i).pm);
            Assert.AreEqual(expectedEmissions.ElementAt(i).trips, emissions.ElementAt(i).trips);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        }
    }
}