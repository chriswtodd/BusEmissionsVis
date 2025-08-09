using Migration.Models;
using MongoDB.Driver;
using Server.Models;
using Server.Models.Constants;

public class MongoDbDoubleToDecimal128Migrator : MongoDbMigratorBase, IMongoDbDoubleToDecimal128Migrator
{
    public MongoDbDoubleToDecimal128Migrator(IProvider<MongoClient> provider) : base(provider)
    { }

    protected override void BeforeStart()
    {
        Console.WriteLine($"Starting {nameof(MongoDbDoubleToDecimal128Migrator)}.");
    }


    protected override void AfterCompletion()
    {
        Console.WriteLine($"Starting {nameof(MongoDbDoubleToDecimal128Migrator)}.");
    }

    protected override void RunMainJob()
    {
        using var client = Provider.Resolve();

        var collection = client.GetDatabase("test")
            .GetCollection<WellingtonEmissions>(DatabaseTables.Trips);

        var pipeline = new EmptyPipelineDefinition<WellingtonEmissions>()
            .Set(x => new WellingtonEmissionsDecimalHolder
            {
                distance = Mql.Convert(x.Distance, new ConvertOptions<decimal>()),
                Fc = Mql.Convert(x.Fc, new ConvertOptions<decimal>()),
                Co = Mql.Convert(x.Co, new ConvertOptions<decimal>()),
                Hc = Mql.Convert(x.Hc, new ConvertOptions<decimal>()),
                Pm = Mql.Convert(x.Pm, new ConvertOptions<decimal>()),
                Nox = Mql.Convert(x.Nox, new ConvertOptions<decimal>()),
                Co2 = Mql.Convert(x.Co2, new ConvertOptions<decimal>()),
                CarCo2Equivalent = Mql.Convert(x.CarCo2Equivalent, new ConvertOptions<decimal>()),
                PaxKm = Mql.Convert(x.PaxKm, new ConvertOptions<decimal>()),
            });

        collection.UpdateMany(Builders<WellingtonEmissions>.Filter.Empty, pipeline);
    }
}