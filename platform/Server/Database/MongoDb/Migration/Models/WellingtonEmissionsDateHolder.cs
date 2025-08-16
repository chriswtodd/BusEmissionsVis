using MongoDB.Bson.Serialization.Attributes;

namespace Migration.Models;

[BsonIgnoreExtraElements]
public class WellingtonEmissionsDateHolder<T>
{
    [BsonElement("date")]
    public T date { get; set; }
}