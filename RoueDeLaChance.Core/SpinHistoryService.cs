using System.Text.Json;

namespace RoueDeLaChance.Core
{
    public class SpinEntry
    {
        public string PrizeName { get; set; } = string.Empty;
        public bool IsWin { get; set; }
        public string SpunAt { get; set; } = string.Empty;
    }

    public interface ISpinHistoryService
    {
        Task AddEntryAsync(SpinEntry entry);
        Task<IReadOnlyList<SpinEntry>> GetAllEntriesAsync();
    }

    public class SpinHistoryService(string filePath) : ISpinHistoryService
    {
        private static readonly SemaphoreSlim _lock = new(1, 1);
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public async Task AddEntryAsync(SpinEntry entry)
        {
            await _lock.WaitAsync();
            try
            {
                var entries = await ReadFromDiskAsync();
                entries.Insert(0, entry); // plus récent en premier
                await WriteToDiskAsync(entries);
            }
            finally
            {
                _lock.Release();
            }
        }

        public async Task<IReadOnlyList<SpinEntry>> GetAllEntriesAsync()
        {
            await _lock.WaitAsync();
            try
            {
                return await ReadFromDiskAsync();
            }
            finally
            {
                _lock.Release();
            }
        }

        private async Task<List<SpinEntry>> ReadFromDiskAsync()
        {
            if (!File.Exists(filePath))
                return [];

            var json = await File.ReadAllTextAsync(filePath);
            return JsonSerializer.Deserialize<List<SpinEntry>>(json, _jsonOptions)
                   ?? [];
        }

        private async Task WriteToDiskAsync(List<SpinEntry> entries)
        {
            var json = JsonSerializer.Serialize(entries, _jsonOptions);
            await File.WriteAllTextAsync(filePath, json);
        }
    }
}
