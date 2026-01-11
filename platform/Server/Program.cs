using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
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

        ConfigureIdentityServices(builder);
        ConfigureServices(builder.Services, env);

        var app = builder.Build();

        app.UseFactoryActivatedMiddleware();

        if (app.Environment.IsDevelopment())
        {
            app.UseCors(_devOnly);
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI(o =>
            {
                o.OAuthClientId(builder.Configuration["Authentication:Google:ClientId"]);
                o.OAuthUsePkce();
            });
            app.UseCookiePolicy();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }

    private static void ConfigureIdentityServices(WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<ApplicationDbContext>(
            options => options.UseInMemoryDatabase("AppDb"));
        builder.Services.Configure<CookiePolicyOptions>(options =>
        {
            options.Secure = CookieSecurePolicy.SameAsRequest;
            options.HttpOnly = HttpOnlyPolicy.Always;
        });
        builder.Services.AddAuthorization();

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultChallengeScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;
                options.DefaultForbidScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddGoogleOpenIdConnect(
                authenticationScheme: GoogleOpenIdConnectDefaults.AuthenticationScheme,
                displayName: "Google",
                configureOptions: options =>
                {
                    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
                    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
            });
    }

    private static void ConfigureServices(IServiceCollection services, IHostEnvironment env)
    {
        services.AddTransient<AccessControlAllowMiddleware>();

        services.AddControllers();
        services.AddOpenApi();
        if (env.IsDevelopment())
        {
            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("GoogleOauth", new OpenApiSecurityScheme
                {
                    Description = "Google OAuth 2.0 authorization",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        Implicit = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri("https://accounts.google.com/o/oauth2/v2/auth"),
                            Scopes = new Dictionary<string, string>
                            {
                                { "openid profile email", "Access to your profile and email" }
                            }
                        }
                    }
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "GoogleOauth" }
                        },
                        new[] { "openid profile email" }
                    }
                });
            });
        }

        CompositionRoot.InitializeContainer(services, new AssemblyContainingHint());
    }
}

public partial class Program { }