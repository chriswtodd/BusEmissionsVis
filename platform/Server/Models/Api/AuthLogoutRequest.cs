using System.Text.Json.Serialization;

namespace Server.Models.Api;

public class AuthLogoutRequest : ICallback
{
    [JsonPropertyName("callback")]
    public required string Callback { get; set; }
}