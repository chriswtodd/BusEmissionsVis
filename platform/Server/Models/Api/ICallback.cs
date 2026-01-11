using System.Text.Json.Serialization;

namespace Server.Models.Api;

public interface ICallback
{
    [JsonPropertyName("callback")]
    string Callback { get; set; }
}