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

app.MapPost("/config/prizes", async (List<Prize> newPrizes) =>
{
    if (newPrizes == null || newPrizes.Count == 0) return Results.BadRequest("Liste invalide");
    if (Math.Abs(newPrizes.Sum(p => p.Probability) - 1.0) > 0.0001) return Results.BadRequest("La somme doit faire exactement 1.");
    if (newPrizes.Any(p => p.Name?.Length > 100)) return Results.BadRequest("Un titre dépasse 100 caractères.");

    // Modifier le fichier source racine
    var sourceJson = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
    if (!File.Exists(sourceJson)) return Results.NotFound("appsettings.json introuvable.");

    var json = await File.ReadAllTextAsync(sourceJson);
    var node = System.Text.Json.Nodes.JsonNode.Parse(json);
    if (node?["PrizeSettings"] is System.Text.Json.Nodes.JsonObject prizeSettings)
    {
        var array = new System.Text.Json.Nodes.JsonArray();
        foreach (var p in newPrizes)
        {
            array.Add(new System.Text.Json.Nodes.JsonObject
            {
                ["name"] = p.Name ?? "Lot",
                ["probability"] = p.Probability,
                ["color"] = p.Color ?? "#92DF36"
            });
        }
        prizeSettings["Prizes"] = array;

        var options = new System.Text.Json.JsonSerializerOptions { WriteIndented = true };
        var newJsonContent = node.ToJsonString(options);
        
        await File.WriteAllTextAsync(sourceJson, newJsonContent);

        // Modifier le fichier copié dans le dossier bin pour déclencher le IOptionsMonitor sans redémarrer
        var binJson = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
        if (File.Exists(binJson) && binJson != sourceJson)
        {
            await File.WriteAllTextAsync(binJson, newJsonContent);
        }

        return Results.Ok();
    }
    return Results.BadRequest("Structure json invalide dans appsettings.json");
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
