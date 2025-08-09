namespace Server.Services;

public interface IRoutesService
{
    public IDictionary<string, bool> Routes { get; set; }
}