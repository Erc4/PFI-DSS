using System.Text.Json.Serialization;

namespace perceptron_service.Models
{
    public class PredictRequest
    {
        [JsonPropertyName("features")]
        public double[] Features { get; set; }
    }
}