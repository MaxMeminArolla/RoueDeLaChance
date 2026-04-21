using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;

namespace RoueDeLaChance.Core
{
    public interface IPrizeProvider
    {
        IList<Prize> GetPrizes();
    }

    public class ConfigurationPrizeProvider : IPrizeProvider
    {
        private readonly IOptionsMonitor<PrizeSettings>? _optionsMonitor;
        private readonly PrizeSettings? _settings;

        public ConfigurationPrizeProvider(IOptionsMonitor<PrizeSettings> optionsMonitor)
        {
            _optionsMonitor = optionsMonitor;
        }

        // New constructor to support IConfiguration directly (useful for tests)
        ConfigurationPrizeProvider(IConfiguration configuration)
        {
            _settings = configuration.Get<PrizeSettings>();
        }

        public IList<Prize> GetPrizes()
        {
            var settings = _optionsMonitor?.CurrentValue ?? _settings;
            if (settings?.Prizes == null)
            {
                return [];
            }
            return settings.Prizes;
        }
    }
}
