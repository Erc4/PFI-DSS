import numpy as np
from sklearn.tree import DecisionTreeClassifier

class DecisionTree:
    def __init__(self, max_depth=5, min_samples_split=2):
        self.model = DecisionTreeClassifier(
            max_depth=max_depth,
            min_samples_split=min_samples_split
        )

    def fit(self, X, y):
        self.model.fit(X, y)
        return self

    def predict(self, X):
        return self.model.predict([X])[0]