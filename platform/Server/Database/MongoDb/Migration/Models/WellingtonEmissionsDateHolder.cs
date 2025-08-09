using MongoDB.Bson.Serialization.Attributes;

namespace Migration.Models;

[BsonIgnoreExtraElements]
public class WellingtonEmissionsDateHolder
{
    [BsonElement("date")]
    public DateTime date { get; set; }
}