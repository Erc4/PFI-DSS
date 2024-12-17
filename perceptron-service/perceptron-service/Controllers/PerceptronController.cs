using Microsoft.AspNetCore.Mvc;
using perceptron_service.Models;
using perceptron_service.Services;
using System;

namespace perceptron_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerceptronController : ControllerBase
    {
        private static SimplePerceptron _model;

        [HttpPost("train")]
        public IActionResult TrainModel([FromBody] TrainingRequest request)
        {
            try
            {
                var X = request.Data.Select(d => d.Features).ToArray();
                var y = request.Data.Select(d => d.Label).ToArray();

                _model = new SimplePerceptron(X[0].Length);
                _model.Train(X, y);

                return Ok(new { message = "Perceptrón entrenado exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error en entrenamiento: {ex.Message}" });
            }
        }

        [HttpPost("predict")]
        public IActionResult Predict([FromBody] PredictRequest request)
        {
            if (_model == null)
            {
                return BadRequest(new { message = "Modelo no entrenado" });
            }

            try
            {
                int prediction = _model.Predict(request.Features);
                return Ok(new { prediction = prediction });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error en predicción: {ex.Message}" });
            }
        }
    }
}
