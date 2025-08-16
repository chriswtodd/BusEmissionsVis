public partial class Program
{
    private static void Main(string[] args)
    {
        var _devOnly = "_devOnly";

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: _devOnly,
                policy =>
                {
                    policy.WithOrigins("localhost:5173");
                });
        });

        IHostEnvironment env = builder.Environment;

        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true, true);

        ConfigureServices(builder.Services);

        var app = builder.Build();

        app.UseFactoryActivatedMiddleware();
        app.UseCors(_devOnly);

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }

    private static void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<AccessControlAllowOriginHeaderMiddleware>();

        services.AddControllers();
        services.AddOpenApi();

        CompositionRoot.InitializeContainer(services, new AssemblyContainingHint());
    }
}

public partial class Program { }