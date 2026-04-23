
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

            var available = prizes.Where(p => p.Probability > 0).ToList();
            if (!available.Any())
            {
                return new SpinResult("Perdu", false, -1, ComputeTargetAngle(prizes, -1));
            }

            var totalProbability = available.Sum(p => p.Probability);
            var roll = _randomProvider.NextDouble() * totalProbability;
            var cumulative = 0.0;

            for (int i = 0; i < available.Count; i++)
            {
                cumulative += available[i].Probability;
                if (roll <= cumulative)
                {
                    var item = available[i];
                    var isWin = !string.Equals(item.Name, "Perdu", StringComparison.OrdinalIgnoreCase);
                    var prizeIndex = prizes.IndexOf(item);
                    var angle = ComputeTargetAngle(prizes, prizeIndex);
                    return new SpinResult(item.Name, isWin, prizeIndex, angle);
                }
            }

            return new SpinResult("Perdu", false, -1, ComputeTargetAngle(prizes, -1));
        }

        private static double ComputeTargetAngle(IList<Prize> prizes, int prizeIndex)
        {
            const double pointerAngle = 270;
            
            // Les parts visuelles Front sont maintenant toutes de taille équidistante
            var sweep = 360.0 / prizes.Count;
            var cumulative = 0.0;

            for (int i = 0; i < prizes.Count; i++)
            {
                if (i == prizeIndex)
                {
                    // L'angle cible est le milieu de la part
                    var center = cumulative + sweep / 2;
                    var angle = ((pointerAngle - center) % 360 + 360) % 360;
                    return angle;
                }

                cumulative += sweep;
            }

            return pointerAngle;
        }
    }

    public class SpinResult
    {
        public string PrizeName { get; }
        public bool IsWin { get; }
        public int PrizeIndex { get; }
        public double Angle { get; }

        public SpinResult(string prizeName, bool isWin, int prizeIndex, double angle)
        {
            PrizeName = prizeName;
            IsWin = isWin;
            PrizeIndex = prizeIndex;
            Angle = angle;
        }
    }
}
