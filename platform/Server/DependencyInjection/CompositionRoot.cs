using Server.Services;

public static class CompositionRoot
{
    public static void InitializeContainer(IServiceCollection services, IAssemblyContainingHint assemblyContainingHint)
    {
        services.RegisterServicesFromAssemblyUsingHint(assemblyContainingHint);
        services.AddSingleton<IRoutesService, RoutesService>();
    }
}