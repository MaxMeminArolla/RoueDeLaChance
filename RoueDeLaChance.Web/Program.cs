using RoueDeLaChance.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IPrizeProvider, ConfigurationPrizeProvider>();
builder.Services.AddSingleton<IRandomNumberProvider, SystemRandomNumberProvider>();
builder.Services.AddTransient<WheelEngine>();
builder.Services.AddOpenApi();

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

app.MapPost("/spin", (WheelEngine engine, IPrizeProvider prizeProvider) =>
{
    var prizes = prizeProvider.GetPrizes();
    var result = engine.Spin(prizes);
    return Results.Ok(result);
});

app.Run();
