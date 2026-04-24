namespace RoueDeLaChance.Core
{
    public class Prize
    {
        public string Name { get; set; } = string.Empty;
        public double Probability { get; set; }
        public string? Color { get; set; }

        public Prize() { }

        public Prize(string name, double probability, string? color)
        {
            Name = name;
            Probability = probability;
            Color = color;
        }
    }
}
