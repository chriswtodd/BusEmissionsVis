using System.Text.Json.Serialization;

namespace Server.Models.Api;

public class AuthGoogleUserInfoResponse
{
    [JsonPropertyName("nameIdentifier")]
    public string? NameIdentifier { get; set; }
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("givenName")]
    public string? GivenName { get; set; }
    [JsonPropertyName("surname")]
    public string? Surname { get; set; }
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    [JsonPropertyName("emailVerified")]
    public bool EmailVerified { get; set; }
    [JsonPropertyName("picture")]
    public string? Picture { get; set; }
}