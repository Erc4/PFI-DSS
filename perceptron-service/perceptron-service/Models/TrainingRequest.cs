using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace perceptron_service.Models
{
    public class TrainingRequest
    {
        [JsonPropertyName("data")]
        public List<TrainingData> Data { get; set; }
    }
}
