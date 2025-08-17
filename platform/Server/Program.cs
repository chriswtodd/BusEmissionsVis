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

        if (app.Environment.IsDevelopment())
        {
            app.UseCors(_devOnly);
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }

    private static void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<AccessControlAllowMiddleware>();

        services.AddControllers();
        services.AddOpenApi();

        CompositionRoot.InitializeContainer(services, new AssemblyContainingHint());
    }
}

public partial class Program { }