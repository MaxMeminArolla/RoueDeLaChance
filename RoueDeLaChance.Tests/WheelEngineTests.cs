using Microsoft.Extensions.Configuration;
using RoueDeLaChance.Core;

namespace RoueDeLaChance.Tests;

public class WheelEngineTests
{
    private class StubRandomNumberProvider(IEnumerable<double> values) : IRandomNumberProvider
    {
        private readonly Queue<double> _values = new(values);

        public double NextDouble() => _values.Dequeue();
    }

    private readonly ConfigurationPrizeProvider provider;

    public WheelEngineTests()
    {
        // Le fichier est maintenant copié localement grâce au lien dans le .csproj
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.Development.json", optional: false, reloadOnChange: false)
            .Build();

        provider = new ConfigurationPrizeProvider(configuration);
    }

    [Fact]
    public void PrizeProvider_should_load_prizes_from_configuration()
    {
        var prizes = provider.GetPrizes();
     
        Assert.Equal("Formation context engineering", prizes[0].Name);
        Assert.Equal(0.05, prizes[0].Probability);
    }

    [Fact]
    public void SumOfProbabilities_should_be_equal_to_one()
    {
        var prizes = provider.GetPrizes();
        double total = 0;
        foreach (var prize in prizes)
        {
            total += prize.Probability;
        }

        // Utilisation d'une tolérance (epsilon) pour les calculs en virgule flottante
        Assert.InRange(total, 0.9999999999, 1.0000000001);
    }
}

public class ConfigurationPrizeProvider(IConfiguration configuration) : IPrizeProvider
{
    private readonly PrizeSettings? _settings = configuration.Get<PrizeSettings>();

    public IList<Prize> GetPrizes()
    {
        if (_settings?.Prizes == null)
        {
            return [];
        }
        return _settings.Prizes;
    }
}
