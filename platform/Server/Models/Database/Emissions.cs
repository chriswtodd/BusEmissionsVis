namespace Server.Models.Database;

public sealed class Emissions
{
    public required decimal avgDistance { get; set; }
    public required decimal avgSpeed { get; set; }
    public required decimal avgTime { get; set; }
    public required decimal carCo2Equiv { get; set; }
    public required decimal co { get; set; }
    public required decimal co2 { get; set; }
    public required DateTime date { get; set; }
    public required string engine_type { get; set; }
    public required decimal fc { get; set; }
    public required decimal hc { get; set; }
    public required decimal nox { get; set; }
    public required Nullable<double> paxKm { get; set; }
    public required decimal pm { get; set; }
    public required int trips { get; set; }
}