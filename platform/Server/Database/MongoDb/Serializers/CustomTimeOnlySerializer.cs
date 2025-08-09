using MongoDB.Bson.Serialization;

namespace Server.Database.Mongo.Serializers;

public sealed class CustomTimeOnlySerializer : IBsonSerializer<TimeOnly>
{
    /// <inheritdoc />
    public Type ValueType => typeof(TimeOnly);

    /// <inheritdoc />
    public TimeOnly Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        var reader = context.Reader;
        reader.ReadStartDocument();

        var fullTime = reader.ReadString();
        reader.ReadEndDocument();

        if (fullTime.Contains(':'))
        {
            var timeParts = fullTime.Split(":");

            if (timeParts.Length == 2)
            {
                var hourSuccessful = int.TryParse(timeParts[0], out var hour);
                var minuteSuccessful = int.TryParse(timeParts[1], out var minute);

                if (hourSuccessful && minuteSuccessful)
                {
                    return new TimeOnly(hour, minute);
                }
            }
            if (timeParts.Length == 3)
            {
                var hourSuccessful = int.TryParse(timeParts[0], out var hour);
                var minuteSuccessful = int.TryParse(timeParts[1], out var minute);
                var secondSuccessful = int.TryParse(timeParts[2], out var second);

                if (hourSuccessful && minuteSuccessful && secondSuccessful)
                {
                    return new TimeOnly(hour, minute, second);
                }
            }
        }
        else
        {
            if (int.TryParse(fullTime, out var parsedTime))
            {
                return new TimeOnly(parsedTime, 0);
            }
        }
        throw new ArgumentOutOfRangeException();
    }

    /// <inheritdoc />
    public void Serialize(BsonSerializationContext context, BsonSerializationArgs args, TimeOnly obj)
    {
        context.Writer.WriteString(obj.ToString("HH:mm:ss"));
    }

    // explicit interface implementations
    object IBsonSerializer.Deserialize(BsonDeserializationContext context, BsonDeserializationArgs args)
    {
        return Deserialize(context, args);
    }

    void IBsonSerializer.Serialize(BsonSerializationContext context, BsonSerializationArgs args, object value)
    {
        Serialize(context, args, (TimeOnly)value);
    }
}