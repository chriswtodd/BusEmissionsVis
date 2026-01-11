using System.Text.Json.Serialization;

namespace Server.Models.Api;

public class AuthGoogleRequest : ICallback
{
    [JsonPropertyName("callback")]
    public required string Callback { get; set; }
}