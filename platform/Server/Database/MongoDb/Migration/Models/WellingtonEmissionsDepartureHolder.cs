using MongoDB.Bson.Serialization.Attributes;

namespace Migration.Models;

[BsonIgnoreExtraElements]
public class WellingtonEmissionsDepartureHolder
{
    [BsonElement("departure")]
    public string Departure { get; set; }
}