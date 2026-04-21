using System.Linq;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace RoueDeLaChance.Core
{
    public interface IPrizeProvider
    {
        IList<Prize> GetPrizes();
    }

    public class ConfigurationPrizeProvider : IPrizeProvider
    {
        private readonly IOptionsMonitor<PrizeSettings> _optionsMonitor;

        public ConfigurationPrizeProvider(IOptionsMonitor<PrizeSettings> optionsMonitor)
        {
            _optionsMonitor = optionsMonitor;
        }

        public IList<Prize> GetPrizes()
        {
            var settings = _optionsMonitor.CurrentValue;
            if (settings.Prizes == null)
            {
                return new List<Prize>();
            }

            return new List<Prize>(settings.Prizes);
        }
    }
}
