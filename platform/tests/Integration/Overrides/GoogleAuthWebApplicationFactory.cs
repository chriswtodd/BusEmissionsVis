using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;

namespace Tests.Integration.Overrides;

public class GoogleAuthWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.AddAuthentication(GoogleTestAuthenticationHandler.AuthenticationScheme)
                .AddScheme<AuthenticationSchemeOptions, GoogleTestAuthenticationHandler>(
                    GoogleTestAuthenticationHandler.AuthenticationScheme, options => { });
        });

        builder.UseEnvironment("Development");
    }
}