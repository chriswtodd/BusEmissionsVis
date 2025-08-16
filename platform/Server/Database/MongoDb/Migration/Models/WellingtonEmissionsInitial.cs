using MongoDB.Bson.Serialization.Attributes;
using Server.Database.Mongo.Serializers;

namespace Migration.Models;

/// <summary>
/// Represents the original MongoDB model before migration
/// </summary>
/// <typeparam name="T"></typeparam>
[BsonIgnoreExtraElements]
public class WellingtonEmissionsInitial
{
    [BsonElement("date")]
    public string? Date { get; set; }
    [BsonElement("route")]
    public string? Route { get; set; }
    [BsonElement("departure")]
    [BsonSerializer(typeof(CustomTimeOnlySerializer))]
    public TimeOnly Departure { get; set; }
    [BsonElement("engine_type")]
    public string? EngineType { get; set; }
    [BsonElement("speed")]
    public int Speed { get; set; }
    [BsonElement("distance")]
    public double Distance { get; set; }
    [BsonElement("time")]
    public string? Time { get; set; }
    [BsonElement("FC")]
    public double Fc { get; set; }
    [BsonElement("CO")]
    public double Co { get; set; }
    [BsonElement("HC")]
    public double Hc { get; set; }
    [BsonElement("PM")]
    public double Pm { get; set; }
    [BsonElement("NOx")]
    public double Nox { get; set; }
    [BsonElement("CO2")]
    public double Co2 { get; set; }
    [BsonElement("car_co2_equiv")]
    public double CarCo2Equivalent { get; set; }
    [BsonElement("pax_km")]
    public string? PaxKm { get; set; }
}