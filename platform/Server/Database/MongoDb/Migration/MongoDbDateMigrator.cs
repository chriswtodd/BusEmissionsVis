using Migration.Models;
using MongoDB.Driver;
using Server.Models;
using Server.Models.Constants;

public class MongoDbDateMigrator : MongoDbMigratorBase, IMongoDbDateMigrator
{
    public MongoDbDateMigrator(IProvider<MongoClient> provider) : base(provider)
    { }


    protected override void BeforeStart()
    {
        Console.WriteLine($"Starting {nameof(MongoDbDateMigrator)}.");
    }


    protected override void AfterCompletion()
    {
        Console.WriteLine($"{nameof(MongoDbDateMigrator)} completed successfully.");
    }

    protected override void RunMainJob()
    {
        using var client = Provider.Resolve();

        var collection = client.GetDatabase("test")
            .GetCollection<WellingtonEmissionsInitial>(DatabaseTables.Trips);

        var pipelineTempDateHolder = new EmptyPipelineDefinition<WellingtonEmissionsInitial>()
            .Set(x => new WellingtonEmissionsDateHolder<DateTime>
            {
                date = Mql.DateFromString(x.Date)
            });

        collection.UpdateMany(Builders<WellingtonEmissionsInitial>.Filter.Empty, pipelineTempDateHolder);
    }
}