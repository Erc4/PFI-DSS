using System.Text.Json.Serialization;
namespace perceptron_service.Models
{
    public class TrainingData
    {
        [JsonPropertyName("features")]
        public double[] Features { get; set; }

        [JsonPropertyName("label")]
        public int Label { get; set; }
    }
}