using Microsoft.Extensions.Configuration;
using RoueDeLaChance.Core;

namespace RoueDeLaChance.Tests;

public class WheelEngineTests
{
    private class StubRandomNumberProvider : IRandomNumberProvider
    {
        private readonly Queue<double> _values;

        public StubRandomNumberProvider(IEnumerable<double> values) => _values = new Queue<double>(values);

        public double NextDouble() => _values.Dequeue();
    }

    private readonly ConfigurationPrizeProvider provider;

    public WheelEngineTests()
    {
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("C:\\Users\\Nuc Skull Canyon\\source\\repos\\RoueDeLaChance\\RoueDeLaChance\\RoueDeLaChance.Web\\appsettings.Development.json", optional: false, reloadOnChange: false)
            .Build();

        provider = new ConfigurationPrizeProvider(configuration);
    }

    [Fact]
    public void Spin_should_return_expected_prizes_without_quantity()
    {
        var prizes = provider.GetPrizes();

        var stubRandomNumberProvider = new StubRandomNumberProvider(new[] {0.01, 0.06, 0.09, 0.25, 0.50});
        var engine = new WheelEngine(stubRandomNumberProvider);

        var result1 = engine.Spin(prizes);
        Assert.True(result1.IsWin);
        Assert.Equal("Formation context engineering", result1.PrizeName);
        Assert.Equal(0, result1.PrizeIndex);

        var result2 = engine.Spin(prizes);
        Assert.True(result2.IsWin);
        Assert.Equal("Château légo", result2.PrizeName);
        Assert.Equal(1, result2.PrizeIndex);

        var result3 = engine.Spin(prizes);
        Assert.True(result3.IsWin);
        Assert.Equal("Livre software craft", result3.PrizeName);
        Assert.Equal(2, result3.PrizeIndex);

        var result4 = engine.Spin(prizes);
        Assert.True(result4.IsWin);
        Assert.Equal("1 déjeuner", result4.PrizeName);
        Assert.Equal(3, result4.PrizeIndex);

        var result5 = engine.Spin(prizes);
        Assert.False(result5.IsWin);
        Assert.Equal("Perdu", result5.PrizeName);
        Assert.Equal(4, result5.PrizeIndex);
    }

    [Fact]
    public void PrizeProvider_should_load_prizes_from_configuration()
    {
        var prizes = provider.GetPrizes();
     
        Assert.Equal("Formation context engineering", prizes[0].Name);
        Assert.Equal(0.05, prizes[0].Probability);
    }
}
