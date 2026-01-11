using System.Text.Json.Serialization;

namespace Server.Models.Api;

/// <summary>
/// Respoonse model for the who api call
/// 
/// You should check <see cref="Server.Models.Api.WhoGetResponse.IsAuthenticated" /> 
/// before using username anywhere that is not null tolerant
/// </summary>
public class WhoGetResponse
{
    [JsonPropertyName("isAuthenticated")]
    public bool IsAuthenticated { get; set; }

    [JsonPropertyName("username")]
    public string? Username { get; set; }
}