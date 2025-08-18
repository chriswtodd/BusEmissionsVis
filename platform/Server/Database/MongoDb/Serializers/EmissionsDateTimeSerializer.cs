using System.Globalization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace Server.Database.Mongo.Serializers;

public class EmissionsDateTimeSerializer : IBsonSerializer
{
    public Type ValueType => typeof(DateTime);
    public object Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var type = context.Reader.CurrentBsonType;
        switch (type)
        {
            case BsonType.String:
                return ConvertFromString(context);
            default:
                throw new NotSupportedException($"Cannot convert a {type} to a DateTime.");
        }
    }

    private object ConvertFromString(BsonDeserializationContext context)
    {
        var s = context.Reader.ReadString();
        return DateTime.ParseExact(s, "yyyy/MM/dd", CultureInfo.CurrentCulture);
    }

    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
    {
        var date = (DateTime)value;
        date = DateTime.SpecifyKind(date, DateTimeKind.Utc);
        DateTimeOffset dateTimeOffset = date;
        context.Writer.WriteDateTime(dateTimeOffset.ToUnixTimeMilliseconds());
    }
}