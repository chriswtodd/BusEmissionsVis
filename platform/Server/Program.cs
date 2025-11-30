using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Database.Middleware;

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

        ConfigureIdentityServices(builder.Services);
        ConfigureServices(builder.Services);

        var app = builder.Build();

        app.UseFactoryActivatedMiddleware();

        app.MapIdentityApi<IdentityUser>();

        if (app.Environment.IsDevelopment())
        {
            app.UseCors(_devOnly);
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCookiePolicy();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }

    private static void ConfigureIdentityServices(IServiceCollection services)
    {
        services.AddDbContext<ApplicationDbContext>(
            options => options.UseInMemoryDatabase("AppDb"));
        services.Configure<CookiePolicyOptions>(options =>
        {
            options.Secure = CookieSecurePolicy.SameAsRequest;
            options.HttpOnly = HttpOnlyPolicy.Always;
        });
        services.AddAuthorization();
        services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<ApplicationDbContext>();
    }

    private static void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<AccessControlAllowMiddleware>();

        services.AddControllers();
        services.AddOpenApi();
        services.AddSwaggerGen();

        CompositionRoot.InitializeContainer(services, new AssemblyContainingHint());
    }
}

public partial class Program { }