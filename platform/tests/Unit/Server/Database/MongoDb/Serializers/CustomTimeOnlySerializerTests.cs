using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using Moq;
using Server.Database.Mongo.Serializers;

[TestClass]
public sealed class CustomTimeOnlySerializerTests_Serialization
{
    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.OnePartTimeData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenTimesWithOnePart_ParsesToCorrectTimeSuccessfully(string testString, TimeOnlyWrapper expected)
    {
        AssertSerializationReturnsSuccessfully(testString, expected);
    }

    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.TwoPartTimeData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenTimesWithTwoParts_ParsesToCorrectTimeSuccessfully(string testString, TimeOnlyWrapper expected)
    {
        AssertSerializationReturnsSuccessfully(testString, expected);
    }

    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.ThreePartTimeData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenTimesWithThreeParts_ParsesToCorrectTimeSuccessfully(string testString, TimeOnlyWrapper expected)
    {
        AssertSerializationReturnsSuccessfully(testString, expected);
    }


    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.FourPartTimeData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenTimesWithFourParts_SerializerThrowsException(string testString)
    {
        AssertSerializationThrows(testString);
    }


    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.OutOfRangeData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenTimesOutOfRange_SerializerThrowsException(string testString)
    {
        AssertSerializationThrows(testString);
    }

    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.EmptyStringData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenEmptyStrings_SerializerThrowsException(string testString)
    {
        AssertSerializationThrows(testString);
    }

    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.AlphaCharsData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenAlphaChars_SerializerThrowsException(string testString)
    {
        AssertSerializationThrows(testString);
    }


    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Deserialization.NonAlphaNumericCharsData), typeof(CustomTimeOnlySerializerTestsData_Deserialization))]
    public void WhenGivenNonAlphaNumericChars_SerializerThrowsException(string testString)
    {
        AssertSerializationThrows(testString);
    }

    private void AssertSerializationReturnsSuccessfully(string testString, TimeOnlyWrapper expected)
    {
        var underTest = new CustomTimeOnlySerializer();
        var result = underTest.Deserialize(CustomTimeOnlySerializerTestsHelper.GetBsonDeserializationContext(testString), new BsonDeserializationArgs());
        Assert.AreEqual(expected.Time, result);
    }

    private void AssertSerializationThrows(string testString)
    {
        var underTest = new CustomTimeOnlySerializer();

        Assert.ThrowsException<ArgumentOutOfRangeException>(() => underTest.Deserialize(CustomTimeOnlySerializerTestsHelper.GetBsonDeserializationContext(testString), new BsonDeserializationArgs()));
    }
}

[TestClass]
public sealed class CustomTimeOnlySerializerTests_Deserialization
{
    [TestMethod]
    [DynamicData(nameof(CustomTimeOnlySerializerTestsData_Serialization.ValidTimesData), typeof(CustomTimeOnlySerializerTestsData_Serialization))]
    public void WhenGivenTimesWithOnePart_ParsesToCorrectTimeSuccessfully(TimeOnlyWrapper time, string expected)
    {
        var underTest = new CustomTimeOnlySerializer();
        var bsonWriter = new BsonDocumentWriter(new MongoDB.Bson.BsonDocument());
        bsonWriter.WriteStartDocument();
        bsonWriter.WriteName("__v");
        underTest.Serialize(BsonSerializationContext.CreateRoot(bsonWriter), new BsonSerializationArgs(), time.Time);

        Assert.AreEqual(expected, bsonWriter.Document.GetElement(0).Value.ToString());
    }
}

internal static class CustomTimeOnlySerializerTestsHelper
{
    internal static BsonDeserializationContext GetBsonDeserializationContext(string testString)
    {
        var bsonReader = new Mock<IBsonReader>();
        bsonReader.Setup(c => c.ReadString()).Returns(testString);
        var bsonDeserializationContext = BsonDeserializationContext.CreateRoot(bsonReader.Object);
        return bsonDeserializationContext;
    }
}