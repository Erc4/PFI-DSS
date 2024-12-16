#include <vector>
#include <string>
#include <memory>
#include <algorithm>
#include <cmath>
#include <unordered_map>

class DecisionTreeNode
{
public:
    bool isLeaf;
    double value;     // Para nodos hoja (predicción)
    int featureIndex; // Para nodos internos
    double threshold;
    std::shared_ptr<DecisionTreeNode> left;
    std::shared_ptr<DecisionTreeNode> right;

    DecisionTreeNode() : isLeaf(false), value(0), featureIndex(-1), threshold(0) {}
};

class DecisionTree
{
private:
    std::shared_ptr<DecisionTreeNode> root;
    int maxDepth;
    int minSamplesSplit;

    double calculateVariance(const std::vector<double> &y)
    {
        if (y.empty())
            return 0.0;
        double sum = 0.0, squareSum = 0.0;
        for (double val : y)
        {
            sum += val;
            squareSum += val * val;
        }
        double mean = sum / y.size();
        return (squareSum / y.size()) - (mean * mean);
    }

    std::pair<double, double> findBestSplit(
        const std::vector<std::vector<double>> &X,
        const std::vector<double> &y,
        int featureIndex)
    {
        double bestGain = 0.0;
        double bestThreshold = 0.0;
        double parentVariance = calculateVariance(y);

        std::vector<double> values;
        for (const auto &row : X)
        {
            values.push_back(row[featureIndex]);
        }
        std::sort(values.begin(), values.end());

        for (size_t i = 0; i < values.size() - 1; i++)
        {
            double threshold = (values[i] + values[i + 1]) / 2.0;

            std::vector<double> leftY, rightY;
            for (size_t j = 0; j < X.size(); j++)
            {
                if (X[j][featureIndex] <= threshold)
                {
                    leftY.push_back(y[j]);
                }
                else
                {
                    rightY.push_back(y[j]);
                }
            }

            double leftVariance = calculateVariance(leftY);
            double rightVariance = calculateVariance(rightY);
            double weightedVariance = (leftY.size() * leftVariance + rightY.size() * rightVariance) / y.size();
            double gain = parentVariance - weightedVariance;

            if (gain > bestGain)
            {
                bestGain = gain;
                bestThreshold = threshold;
            }
        }

        return {bestGain, bestThreshold};
    }

    std::shared_ptr<DecisionTreeNode> buildTree(
        const std::vector<std::vector<double>> &X,
        const std::vector<double> &y,
        int depth)
    {
        auto node = std::make_shared<DecisionTreeNode>();

        if (depth >= maxDepth || y.size() <= minSamplesSplit || calculateVariance(y) < 1e-7)
        {
            node->isLeaf = true;
            double sum = 0.0;
            for (double val : y)
                sum += val;
            node->value = sum / y.size();
            return node;
        }

        double bestGain = 0.0;
        int bestFeature = -1;
        double bestThreshold = 0.0;

        for (size_t feature = 0; feature < X[0].size(); feature++)
        {
            auto [gain, threshold] = findBestSplit(X, y, feature);
            if (gain > bestGain)
            {
                bestGain = gain;
                bestFeature = feature;
                bestThreshold = threshold;
            }
        }

        if (bestFeature == -1)
        {
            node->isLeaf = true;
            double sum = 0.0;
            for (double val : y)
                sum += val;
            node->value = sum / y.size();
            return node;
        }

        node->featureIndex = bestFeature;
        node->threshold = bestThreshold;

        std::vector<std::vector<double>> leftX, rightX;
        std::vector<double> leftY, rightY;

        for (size_t i = 0; i < X.size(); i++)
        {
            if (X[i][bestFeature] <= bestThreshold)
            {
                leftX.push_back(X[i]);
                leftY.push_back(y[i]);
            }
            else
            {
                rightX.push_back(X[i]);
                rightY.push_back(y[i]);
            }
        }

        node->left = buildTree(leftX, leftY, depth + 1);
        node->right = buildTree(rightX, rightY, depth + 1);

        return node;
    }

public:
    DecisionTree(int maxDepth = 5, int minSamplesSplit = 2)
        : maxDepth(maxDepth), minSamplesSplit(minSamplesSplit) {}

    void fit(const std::vector<std::vector<double>> &X, const std::vector<double> &y)
    {
        root = buildTree(X, y, 0);
    }

    double predict(const std::vector<double> &features)
    {
        auto node = root;
        while (!node->isLeaf)
        {
            if (features[node->featureIndex] <= node->threshold)
            {
                node = node->left;
            }
            else
            {
                node = node->right;
            }
        }
        return node->value;
    }
};

// Bindings para Python usando pybind11
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

PYBIND11_MODULE(decision_tree_cpp, m)
{
    py::class_<DecisionTree>(m, "DecisionTree")
        .def(py::init<int, int>())
        .def("fit", &DecisionTree::fit)
        .def("predict", &DecisionTree::predict);
}