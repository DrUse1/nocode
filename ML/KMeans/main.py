import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

def perform_kmeans_clustering(data, n_clusters=3, random_state=None):
    """
    Perform k-Means clustering using scikit-learn.

    Parameters:
    - data: Dataset (pandas DataFrame)
    - n_clusters: Number of clusters to form (default: 3)
    - random_state: Seed for random number generation (default: None)

    Returns:
    - results: Dictionary containing k-Means clustering evaluation metrics
    """
    X = data

    model = KMeans(n_clusters=n_clusters, random_state=random_state)
    clusters = model.fit_predict(X)

    silhouette_avg = silhouette_score(X, clusters)

    results = {
        "Silhouette Score": silhouette_avg,
        "Clusters": clusters,
    }

    return results
