public static class MiddlewareExtensions
{

    public static IApplicationBuilder UseFactoryActivatedMiddleware(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AccessControlAllowOriginHeaderMiddleware>();
    }
}