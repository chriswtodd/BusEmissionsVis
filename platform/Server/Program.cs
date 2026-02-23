using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using Server.Common;
using Server.Database.Middleware;

public partial class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        IHostEnvironment env = builder.Environment;

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration)
            .CreateLogger();

        ConfigureCorsPolicy(builder);

        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", false, true);

        ConfigureIdentityServices(builder);
        ConfigureServices(builder.Services, env);

        var app = builder.Build();

        if (app.Environment.IsProduction())
        { 
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
        }

        app.UseFactoryActivatedMiddleware();
        app.UseCors(Constants.Cors.CurrentPolicy);

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI(o =>
            {
                o.OAuthClientId(builder.Configuration["Authentication:Google:ClientId"]);
                o.OAuthUsePkce();
            });
        }
        ConfigureCookiePolicy(app);

        if (app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
            app.UseHsts();
        }

        app.UseHttpLogging();

        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }

    private static void ConfigureCorsPolicy(WebApplicationBuilder builder)
    {
        if (builder.Configuration["Urls:BaseUrl"] is not null)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: Constants.Cors.CurrentPolicy,
                    policy =>
                    {
                        policy.WithOrigins(builder.Configuration["Urls:BaseUrl"]);
                    });
            });
            return;
        }
        throw new ArgumentNullException(nameof(builder));
    }

    private static void ConfigureCookiePolicy(WebApplication app)
    {
        var cookiePolicy = new CookiePolicyOptions
        { 
            Secure = CookieSecurePolicy.Always,
            HttpOnly = HttpOnlyPolicy.Always,
            MinimumSameSitePolicy = SameSiteMode.None,

        };

        if (app.Environment.IsProduction())
        {
            cookiePolicy.Secure = CookieSecurePolicy.Always;
            cookiePolicy.HttpOnly = HttpOnlyPolicy.Always;
            cookiePolicy.MinimumSameSitePolicy = SameSiteMode.None;
        }

        app.UseCookiePolicy(cookiePolicy);
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

        builder.Services.AddHttpLogging(options =>
        {
            options.LoggingFields = HttpLoggingFields.RequestPropertiesAndHeaders |
                                    HttpLoggingFields.ResponsePropertiesAndHeaders;

            options.RequestHeaders.Add("*");
            options.ResponseHeaders.Add("*");

            options.CombineLogs = true;
        });

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
                    options.CorrelationCookie.SameSite = SameSiteMode.None;
                    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always;
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