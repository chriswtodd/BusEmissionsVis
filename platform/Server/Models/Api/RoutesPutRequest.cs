using System.Text.Json.Serialization;

namespace Server.Models.Api;

public class RoutesPutRequest
{
    [JsonPropertyName("routes")]
    public required IDictionary<string, bool> Routes { get; set; }
}