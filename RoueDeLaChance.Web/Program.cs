using RoueDeLaChance.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<PrizeSettings>(builder.Configuration.GetSection("PrizeSettings"));
builder.Services.AddSingleton<IPrizeProvider, ConfigurationPrizeProvider>();
builder.Services.AddSingleton<IRandomNumberProvider, SystemRandomNumberProvider>();
builder.Services.AddTransient<WheelEngine>();
builder.Services.AddOpenApi();

// Fichier JSON d'historique stocké à côté de l'exécutable
var historyFilePath = Path.Combine(AppContext.BaseDirectory, "spin-history.json");
builder.Services.AddSingleton<ISpinHistoryService>(new SpinHistoryService(historyFilePath));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/prizes", (IPrizeProvider prizeProvider) =>
{
    var prizes = prizeProvider.GetPrizes();
    return Results.Ok(prizes);
});

app.MapPost("/spin", async (SpinRequest request, WheelEngine engine, IPrizeProvider prizeProvider, ISpinHistoryService history) =>
{
    var prizes = prizeProvider.GetPrizes();
    var result = engine.Spin(prizes);

    var entry = new SpinEntry
    {
        PrizeName = result.PrizeName,
        IsWin = result.IsWin,
        SpunAt = DateTimeOffset.Now.ToString("dd/MM/yyyy HH:mm:ss")
    };
    await history.AddEntryAsync(entry);

    // Enregistrement dans le fichier CSV (même niveau que l'historique JSON)
    var csvPath = Path.Combine(AppContext.BaseDirectory, "spins-export.csv");
    var csvLine = $"{DateTime.Now:yyyyMMddHHmmssfff};{request.Email};{result.PrizeName}{Environment.NewLine}";
    await File.AppendAllTextAsync(csvPath, csvLine);

    return Results.Ok(result);
});

app.MapGet("/history", async (ISpinHistoryService history) =>
{
    var entries = await history.GetAllEntriesAsync();
    return Results.Ok(entries);
});

app.MapGet("/csv", async () =>
{
    var csvPath = Path.Combine(AppContext.BaseDirectory, "spins-export.csv");
    if (!File.Exists(csvPath))
    {
        return Results.NotFound("Le fichier CSV est vide ou inexistant.");
    }
    var content = await File.ReadAllTextAsync(csvPath);
    return Results.Text(content, "text/plain", System.Text.Encoding.UTF8);
});

app.Run();

record SpinRequest(string Email);
