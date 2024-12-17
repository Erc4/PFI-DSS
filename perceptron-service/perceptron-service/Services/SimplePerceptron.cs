using System;
using System.Linq;

namespace perceptron_service.Services
{
    public class SimplePerceptron
    {
        private double[] weights;
        private double bias;
        private double learningRate;
        private int epochs;
        private Random random;

        public SimplePerceptron(int inputSize, double learningRate = 0.01, int epochs = 100)
        {
            random = new Random();

            // Inicializar pesos aleatorios
            weights = new double[inputSize];
            for (int i = 0; i < inputSize; i++)
            {
                weights[i] = random.NextDouble() * 2 - 1;
            }

            // Inicializar sesgo aleatorio
            bias = random.NextDouble() * 2 - 1;

            this.learningRate = learningRate;
            this.epochs = epochs;
        }

        private int Activation(double x)
        {
            return x >= 0 ? 1 : 0;
        }

        public int Predict(double[] inputs)
        {
            double summation = inputs.Select((t, i) => t * weights[i]).Sum() + bias;
            return Activation(summation);
        }

        public void Train(double[][] X, int[] y)
        {
            for (int epoch = 0; epoch < epochs; epoch++)
            {
                for (int i = 0; i < X.Length; i++)
                {
                    int prediction = Predict(X[i]);
                    int error = y[i] - prediction;

                    for (int j = 0; j < weights.Length; j++)
                    {
                        weights[j] += learningRate * error * X[i][j];
                    }

                    bias += learningRate * error;
                }
            }
        }
    }
}
