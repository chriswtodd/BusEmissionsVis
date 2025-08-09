using Migration.Models;
using MongoDB.Driver;
using Server.Models;
using Server.Models.Constants;

public class MongoDbDepartureMigrator : MongoDbMigratorBase, IMongoDbDepartureMigrator
{
    public MongoDbDepartureMigrator(IProvider<MongoClient> provider) : base(provider)
    { }

    protected override void BeforeStart()
    {
        Console.WriteLine($"Starting {nameof(MongoDbDepartureMigrator)}.");
    }


    protected override void AfterCompletion()
    {
        Console.WriteLine($"{nameof(MongoDbDepartureMigrator)} completed execution.");
    }

    protected override void RunMainJob()
    {
        using var client = Provider.Resolve();

        var collection = client.GetDatabase("test")
            .GetCollection<WellingtonEmissionsDepartureHolder>(DatabaseTables.Trips);

        var pipeline = new EmptyPipelineDefinition<WellingtonEmissionsDepartureHolder>()
            .Set(x => new WellingtonEmissionsDepartureHolder
            {
                departure = "00:00:00"
            });

        collection.UpdateMany(Builders<WellingtonEmissionsDepartureHolder>.Filter.Where(x => x.departure == "24:00:00"), pipeline);
    }
}