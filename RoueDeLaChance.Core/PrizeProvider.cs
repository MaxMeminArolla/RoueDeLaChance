using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace RoueDeLaChance.Core
{
    public interface IPrizeProvider
    {
        IList<Prize> GetPrizes();
    }

    public class ConfigurationPrizeProvider : IPrizeProvider
    {
        private readonly PrizeSettings _settings;

        public ConfigurationPrizeProvider(IConfiguration configuration)
        {
            _settings = new PrizeSettings();
            configuration.GetSection("PrizeSettings").Bind(_settings);
        }

        public IList<Prize> GetPrizes()
        {
            if (_settings.Prizes == null)
            {
                return new List<Prize>();
            }

            return new List<Prize>(_settings.Prizes);
        }
    }
}
