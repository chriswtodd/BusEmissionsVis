using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

internal class Program
{
    private static void Main(string[] args)
    {
        HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

        IHostEnvironment env = builder.Environment;

        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", true, true);

        CompositionRoot.InitializeContainer(builder.Services, new AssemblyContainingHint());

        using IHost host = builder.Build();

        var serviceProvider = builder.Services.BuildServiceProvider();

        var dateMigrator = serviceProvider.GetRequiredService<IMongoDbDateMigrator>();
        var decimalMigrator = serviceProvider.GetRequiredService<IMongoDbDoubleToDecimal128Migrator>();
        var departureMigrator = serviceProvider.GetRequiredService<IMongoDbDepartureMigrator>();

        dateMigrator.Run();

        var tasks = new List<Task>
        {
            Task.Run(() =>
            {
                departureMigrator.Run();
            }),
            Task.Run(() =>
            {
                decimalMigrator.Run();
            }),
        };

        Task.WaitAll(tasks.ToArray());

        Console.WriteLine("Migration ran to completion.");
    }
}