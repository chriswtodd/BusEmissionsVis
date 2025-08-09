
using Server.Database.MongoDb.Readers;

namespace Server.Services;

public class RoutesService : IRoutesService
{
    private readonly IReader<IDictionary<string, bool>> _reader;

    /// <summary>
    /// Provides the routes from the collection in the database as a list of ids and flags on initialization
    /// Used for getting the full collection of the data initially, then set and get updates
    /// after that.
    /// </summary>
    /// <param name="reader"></param>
    public RoutesService(IReader<IDictionary<string, bool>> reader)
    {
        _reader = reader;
        Routes = InitializeCollection();
    }

    public IDictionary<string, bool> Routes { get; set; }

    private IDictionary<string, bool> InitializeCollection()
    {
        return _reader.Read();
    }
}