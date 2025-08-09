using System.Text.Json.Serialization;

namespace Server.Models.Api;

public class EmissionsGetRequest
{
    [JsonPropertyName("city")]
    public string? City { get; set; }
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
    [JsonPropertyName("startTime")]
    public TimeOnly StartTime { get; set; }
    [JsonPropertyName("endTime")]
    public TimeOnly EndTime { get; set; }
}