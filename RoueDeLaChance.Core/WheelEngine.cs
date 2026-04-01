
namespace RoueDeLaChance.Core
{
    public interface IRandomNumberProvider
    {
        double NextDouble();
    }

    public class SystemRandomNumberProvider : IRandomNumberProvider
    {
        private readonly Random _random = new();
        public double NextDouble() => _random.NextDouble();
    }

    public class WheelEngine
    {
        private readonly IRandomNumberProvider _randomProvider;

        public WheelEngine(IRandomNumberProvider randomProvider)
        {
            _randomProvider = randomProvider;
        }

        public SpinResult Spin(IList<Prize> prizes)
        {
            if (prizes == null)
            {
                throw new ArgumentNullException(nameof(prizes));
            }

            var available = prizes.Where(p => p.Quantity > 0 && p.Probability > 0).ToList();
            if (!available.Any())
            {
                return new SpinResult("Perdu", false);
            }

            var spinValue = _randomProvider.NextDouble();
            var cumulative = 0.0;
            foreach (var prize in available)
            {
                var sliceEnd = cumulative + prize.Probability;
                if (spinValue < sliceEnd)
                {
                    prize.Quantity -= 1;
                    return new SpinResult(prize.Name, true);
                }

                cumulative = sliceEnd;
            }

            return new SpinResult("Perdu", false);
        }
    }

    public class SpinResult
    {
        public string PrizeName { get; }
        public bool IsWin { get; }

        public SpinResult(string prizeName, bool isWin)
        {
            PrizeName = prizeName;
            IsWin = isWin;
        }
    }
}
