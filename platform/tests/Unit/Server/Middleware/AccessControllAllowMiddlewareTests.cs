using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Moq;

[TestClass]
public sealed class AccessControllAllowMiddlewareTests
{
    [TestMethod]
    public async Task WhenInDevelopment_HeadersAreAddedCorrectly()
    {
        var context = new DefaultHttpContext();

        var env = new Mock<IWebHostEnvironment>();
        env.Setup(e => e.EnvironmentName).Returns("Development");
        var underTest = new AccessControlAllowMiddleware(env.Object);

        await underTest.InvokeAsync(context, (HttpContext context) => Task.CompletedTask);

        Assert.IsTrue(context
            .Response
            .Headers
            .TryGetValue("Access-Control-Allow-Headers", out var allowHeaders)
        );
        Assert.IsTrue(context
            .Response
            .Headers
            .TryGetValue("Access-Control-Allow-Origin", out var allowOrigin)
        );
        Assert.IsTrue(context
            .Response
            .Headers
            .TryGetValue("Access-Control-Allow-Methods", out var allowMethods)
        );
        Assert.AreEqual(allowHeaders.ToString(), "*");
        Assert.AreEqual(allowOrigin.ToString(), "*");
        Assert.AreEqual(allowMethods.ToString(), "*");
    }

    [TestMethod]
    public async Task WhenNotInDevelopment_HeadersAreNotAdded()
    {
        var context = new DefaultHttpContext();

        var env = new Mock<IWebHostEnvironment>();
        env.Setup(e => e.EnvironmentName).Returns("Production");
        var underTest = new AccessControlAllowMiddleware(env.Object);

        await underTest.InvokeAsync(context, (HttpContext context) => Task.CompletedTask);

        Assert.IsFalse(context
            .Response
            .Headers
            .TryGetValue("Access-Control-Allow-Headers", out var allowHeaders)
        );
        Assert.IsFalse(context
            .Response
            .Headers
            .TryGetValue("Access-Control-Allow-Origin", out var allowOrigin)
        );
        Assert.IsFalse(context
            .Response
            .Headers
            .TryGetValue("Access-Control-Allow-Methods", out var allowMethods)
        );
    }
}