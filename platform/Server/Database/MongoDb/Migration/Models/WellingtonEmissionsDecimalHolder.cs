using MongoDB.Bson.Serialization.Attributes;

namespace Migration.Models;

[BsonIgnoreExtraElements]
public class WellingtonEmissionsDecimalHolder
{
    [BsonElement("distance")]
    public decimal Distance { get; set; }
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