using MongoDB.Driver;

public class MongoDbProvider : IProvider<MongoClient>
{
    private readonly IConfiguration _configuration;

    public MongoDbProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public MongoClient Resolve()
    {
        return new MongoClient(_configuration.GetSection("DatabaseSettings")["MongoDb:ConnectionUrl"]);
    }
}