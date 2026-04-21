using Microsoft.Extensions.Options;

namespace RoueDeLaChance.Core
{
    public interface IPrizeProvider
    {
        IList<Prize> GetPrizes();
    }

    public class ConfigurationPrizeProvider(IOptionsMonitor<PrizeSettings> optionsMonitor) : IPrizeProvider
    {
        private readonly IOptionsMonitor<PrizeSettings>? _optionsMonitor = optionsMonitor;
        private readonly PrizeSettings? _settings;

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
