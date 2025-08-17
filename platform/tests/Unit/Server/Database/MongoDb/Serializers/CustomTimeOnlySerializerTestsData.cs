using System.Runtime.Serialization;

/// <summary>
/// Wrapper class for TimeOnly which cannot be serialized and therefore MSTest cannot correctly return the data for it.
/// </summary>
public class TimeOnlyWrapper : ISerializable
{
    public readonly TimeOnly Time;
    /// <summary>
    /// Wrapper class
    /// </summary>
    /// <param name="time">The underlying time</param>
    public TimeOnlyWrapper(TimeOnly time)
    {
        Time = time;
    }

    public void GetObjectData(SerializationInfo info, StreamingContext context)
    {
        // Apprently this can even be empty
    }
}

internal static class CustomTimeOnlySerializerTestsData_Deserialization
{
    internal static IEnumerable<object[]> OnePartTimeData
    {
        get
        {
            return new[]
            {
                new object[] { "0", new TimeOnlyWrapper(new TimeOnly(0)) },
                new object[] { "00", new TimeOnlyWrapper(new TimeOnly(0)) },
                new object[] { "9", new TimeOnlyWrapper(new TimeOnly(9, 0)) },
                new object[] { "09", new TimeOnlyWrapper(new TimeOnly(9, 0)) },
                new object[] { "10", new TimeOnlyWrapper(new TimeOnly(10, 0)) },
                new object[] { "17", new TimeOnlyWrapper(new TimeOnly(17, 0)) },
                new object[] { "23", new TimeOnlyWrapper(new TimeOnly(23, 0)) },
                new object[] { "0000001", new TimeOnlyWrapper(new TimeOnly(1, 0)) },
            };
        }
    }

    internal static IEnumerable<object[]> TwoPartTimeData
    {
        get
        {
            return new[]
            {
                new object[] { "0:00", new TimeOnlyWrapper(new TimeOnly(0)) },
                new object[] { "00:00", new TimeOnlyWrapper(new TimeOnly(0)) },
                new object[] { "09:00", new TimeOnlyWrapper(new TimeOnly(9, 0)) },
                new object[] { "9:00", new TimeOnlyWrapper(new TimeOnly(9, 0)) },
                new object[] { "9:5", new TimeOnlyWrapper(new TimeOnly(9, 5)) }, // ambiguous, but the current behaviour
                new object[] { "09:13", new TimeOnlyWrapper(new TimeOnly(9, 13)) },
                new object[] { "10:00", new TimeOnlyWrapper(new TimeOnly(10, 0)) },
                new object[] { "10:13", new TimeOnlyWrapper(new TimeOnly(10, 13)) },
                new object[] { "17:00", new TimeOnlyWrapper(new TimeOnly(17, 0)) },
                new object[] { "17:13", new TimeOnlyWrapper(new TimeOnly(17, 13)) },
                new object[] { "23:59", new TimeOnlyWrapper(new TimeOnly(23, 59)) },
                new object[] { "0:0000001", new TimeOnlyWrapper(new TimeOnly(0, 1)) },
            };
        }
    }

    internal static IEnumerable<object[]> ThreePartTimeData
    {
        get
        {
            return new[]
            {
                new object[] { "0:00:00", new TimeOnlyWrapper(new TimeOnly(0)) },
                new object[] { "00:00:00", new TimeOnlyWrapper(new TimeOnly(0)) },
                new object[] { "9:00:00", new TimeOnlyWrapper(new TimeOnly(9, 0)) },
                new object[] { "09:00:00", new TimeOnlyWrapper(new TimeOnly(9, 0)) },
                new object[] { "09:5:00", new TimeOnlyWrapper(new TimeOnly(9, 5)) }, // ambiguous, but the current behaviour
                new object[] { "09:13:01", new TimeOnlyWrapper(new TimeOnly(9, 13, 01)) },
                new object[] { "10:00:00", new TimeOnlyWrapper(new TimeOnly(10, 0)) },
                new object[] { "10:13:01", new TimeOnlyWrapper(new TimeOnly(10, 13, 01)) },
                new object[] { "17:00:00", new TimeOnlyWrapper(new TimeOnly(17, 0)) },
                new object[] { "17:13:01", new TimeOnlyWrapper(new TimeOnly(17, 13, 01)) },
                new object[] { "23:59:59", new TimeOnlyWrapper(new TimeOnly(23, 59, 59)) },
                new object[] { "0:0:0000001", new TimeOnlyWrapper(new TimeOnly(0, 0, 1)) },
            };
        }
    }

    internal static IEnumerable<object[]> FourPartTimeData
    {
        get
        {
            return new[]
            {
                new object[] { "0:0:0:0" },
                new object[] { "0:00:00:00" },
                new object[] { "00:00:00:00" },
                new object[] { "09:00:00:00" },
                new object[] { "09:13:01:00" },
                new object[] { "10:00:00:00" },
                new object[] { "10:13:01:00" },
                new object[] { "17:00:00:00" },
                new object[] { "17:13:01:00" },
                new object[] { "23:59:59:59" },
            };
        }
    }

    internal static IEnumerable<object[]> OutOfRangeData
    {
        get
        {
            return new[]
            {
                new object[] { "-1" },
                new object[] { "24" },
                new object[] { "1000" },
                new object[] { "-1:0:0" },
                new object[] { "09:-13:01" },
                new object[] { "10:13:-01" },
                new object[] { "24:00:00" },
                new object[] { "00:60:01" },
                new object[] { "23:59:60" },
                new object[] { "0x0" },
            };
        }
    }

    internal static IEnumerable<object[]> EmptyStringData
    {
        get
        {
            return new[]
            {
                new object[] { "" },
                new object[] { " " }
            };
        }
    }

    internal static IEnumerable<object[]> AlphaCharsData
    {
        get
        {
            return new[]
            {
                new object[] { "a" },
                new object[] { "A" },
                new object[] { "H" },
                new object[] { "z" },
            };
        }
    }

    internal static IEnumerable<object[]> NonAlphaNumericCharsData
    {
        get
        {
            return new[]
            {
                new object[] { "," },
                new object[] { "." },
                new object[] { "}" },
                new object[] { "`" },
            };
        }
    }
}

internal static class CustomTimeOnlySerializerTestsData_Serialization
{
    internal static IEnumerable<object[]> ValidTimesData
    {
        get
        {
            return new[]
            {
                new object[] { new TimeOnlyWrapper(new TimeOnly(0)), "00:00:00" },
                new object[] { new TimeOnlyWrapper(new TimeOnly(0, 0)), "00:00:00" },
                new object[] { new TimeOnlyWrapper(new TimeOnly(0, 0, 0)), "00:00:00" },
                new object[] { new TimeOnlyWrapper(new TimeOnly(1, 0)), "01:00:00" },
                new object[] { new TimeOnlyWrapper(new TimeOnly(1, 0, 0)), "01:00:00" },
                new object[] { new TimeOnlyWrapper(new TimeOnly(0, 1)), "00:01:00"  },
                new object[] { new TimeOnlyWrapper(new TimeOnly(0, 1, 0)), "00:01:00"  },
                new object[] { new TimeOnlyWrapper(new TimeOnly(0, 0, 1)), "00:00:01"  },
                new object[] { new TimeOnlyWrapper(new TimeOnly(23, 59)), "23:59:00" },
                new object[] { new TimeOnlyWrapper(new TimeOnly(23, 59, 59)), "23:59:59" },
            };
        }
    }
}