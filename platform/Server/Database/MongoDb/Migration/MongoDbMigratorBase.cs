using MongoDB.Driver;

public abstract class MongoDbMigratorBase
{
    protected internal readonly IProvider<MongoClient> Provider;
    public MongoDbMigratorBase(IProvider<MongoClient> provider)
    {
        Provider = provider;
    }

    protected abstract void BeforeStart();

    protected abstract void AfterCompletion();

    protected abstract void RunMainJob();

    public void Run()
    {
        BeforeStart();
        RunMainJob();
        AfterCompletion();
    }
}