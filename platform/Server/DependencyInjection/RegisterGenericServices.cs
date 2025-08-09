using System.Reflection;

public static class RegisterGenericServices
{ 
    public static void RegisterServicesFromAssemblyUsingHint(this IServiceCollection services, IAssemblyContainingHint assemblyContainingHint)
    {
        if (assemblyContainingHint == null)
        {
            return;
        }

        Assembly.GetAssembly(assemblyContainingHint.GetType())
            .GetTypes()
            .Where(a => !a.IsAbstract && !a.IsInterface)
            .Select(a => new { assignedType = a, serviceTypes = a.GetInterfaces().ToList() })
            .ToList()
            .ForEach(typesToRegister =>
            {
                typesToRegister.serviceTypes.ForEach(typeToRegister => services.AddTransient(typeToRegister, typesToRegister.assignedType));
            });
    }
}
