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
    public void Spin_should_return_expected_prize_and_decrement_quantity()
    {
        var prizes = provider.GetPrizes();

        var stubRandomNumberProvider = new StubRandomNumberProvider([0.01, 0.01, 0.01, 0.015, 0.50]);
        var engine = new WheelEngine(stubRandomNumberProvider);

        var result1 = engine.Spin(prizes);
        Assert.True(result1.IsWin);
        Assert.Equal("Formation context engineering", result1.PrizeName);
        Assert.Equal(2, prizes.Single(p => p.Name == "Formation context engineering").Quantity);

        var result2 = engine.Spin(prizes);
        Assert.True(result2.IsWin);
        Assert.Equal("Formation context engineering", result2.PrizeName);

        var result3 = engine.Spin(prizes);
        Assert.True(result3.IsWin);
        Assert.Equal("Formation context engineering", result3.PrizeName);
        Assert.Equal(0, prizes.Single(p => p.Name == "Formation context engineering").Quantity);

        var result4 = engine.Spin(prizes);
        Assert.True(result4.IsWin);
        Assert.Equal("Château légo", result4.PrizeName);

        var result5 = engine.Spin(prizes);
        Assert.False(result5.IsWin);
        Assert.Equal("Perdu", result5.PrizeName);
    }

    [Fact]
    public void PrizeProvider_should_load_prizes_from_configuration()
    {
        var prizes = provider.GetPrizes();
     
        Assert.Equal("Formation context engineering", prizes[0].Name);
        Assert.Equal(3, prizes[0].Quantity);
        Assert.Equal(0.05, prizes[0].Probability);
    }
}
