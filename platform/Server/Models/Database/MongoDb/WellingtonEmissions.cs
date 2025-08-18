using MongoDB.Bson.Serialization.Attributes;
using Server.Database.Mongo.Serializers;

namespace Server.Models;

[BsonIgnoreExtraElements]
public class WellingtonEmissions
{
    [BsonElement("date")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Unspecified, DateOnly = true)]
    public DateTime Date { get; set; }
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
    public decimal Distance { get; set; }
    [BsonElement("time")]
    public string? Time { get; set; }
    [BsonElement("FC")]
    public decimal Fc { get; set; }
    [BsonElement("CO")]
    public decimal Co { get; set; }
    [BsonElement("HC")]
    public decimal Hc { get; set; }
    [BsonElement("PM")]
    public decimal Pm { get; set; }
    [BsonElement("NOx")]
    public decimal Nox { get; set; }
    [BsonElement("CO2")]
    public decimal Co2 { get; set; }
    [BsonElement("car_co2_equiv")]
    public decimal CarCo2Equivalent { get; set; }
    [BsonElement("pax_km")]
    public decimal PaxKm { get; set; }
}