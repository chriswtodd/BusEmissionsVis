namespace Server.Database.MongoDb.Readers;

public interface IReader<TValue>
{
    TValue Read();
}

public interface IReader<TValue, TRequest>
{
    TValue Read(TRequest request);
}