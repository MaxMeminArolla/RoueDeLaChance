namespace RoueDeLaChance.Core
{
    public class Prize
    {
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public double Probability { get; set; }

        public Prize(string name, int quantity, double probability)
        {
            Name = name;
            Quantity = quantity;
            Probability = probability;
        }
    }
}
