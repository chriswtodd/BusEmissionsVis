using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models;

[Serializable]
public sealed class Routes
{
    [BsonElement("_id")]
    public required string Id { get; set; }

    [BsonElement("active")]
    public required bool Active { get; set; }
}