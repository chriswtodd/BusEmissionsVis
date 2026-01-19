using MongoDB.Driver;
using Server.Database.MongoDb.Readers;
using Server.Models;
using Server.Models.Constants;

public class RoutesReader : IReader<IDictionary<string, bool>>
{
    private readonly IProvider<MongoClient> _provider;

    /// <summary>
    /// Reader to return the collection of routes from the database
    /// </summary>
    /// <param name="IProvider"></param>
    public RoutesReader(IProvider<MongoClient> provider)
    {
        _provider = provider;
    }

    public IDictionary<string, bool> Read()
    {
        using var client = _provider.Resolve();
        var collection = client.GetDatabase(Databases.Emissions)
            .GetCollection<WellingtonEmissions>(DatabaseTables.Emissions.Trips);

        var pipeline = new EmptyPipelineDefinition<WellingtonEmissions>()
            .Match(x => true)
            .Group(x => x.Route, x => new Routes { Id = x.Key, Active = true })
            .Sort(Builders<Routes>.Sort.Ascending(x => x.Id));

        // the logic for mapping to the collection with active flags or otherwise should probably be handled
        // in the called not the reader
        return collection.Aggregate<Routes>(pipeline,
            new AggregateOptions { AllowDiskUse = true })
            .ToList()
            .ToDictionary(x => x.Id, x => x.Active);
    }
}