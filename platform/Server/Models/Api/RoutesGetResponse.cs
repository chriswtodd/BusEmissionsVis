using System.Text.Json.Serialization;

namespace Server.Models.Api;

public class RoutesGetResponse
{
    [JsonPropertyName("routes")]
    public required IDictionary<string, bool> Routes { get; set; }
}