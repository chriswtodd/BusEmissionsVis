public class AccessControlAllowMiddleware : IMiddleware
{
    private readonly IWebHostEnvironment _env;

    /// <summary>
    /// Adds the access control allow XXX headers relevant for CORs requests. 
    /// Currently only for local development.
    /// </summary>
    /// <param name="env"></param>
    public AccessControlAllowMiddleware(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (_env.IsDevelopment())
        {
            context.Response.Headers.Append("Access-Control-Allow-Headers", "*");
            context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
            context.Response.Headers.Append("Access-Control-Allow-Methods", "*");
        }

        await next(context);
    }
}