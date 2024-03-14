import pandas as pd

def determine_problem_type(dataset, target_variable=None, delimiter=","):
    dataset = pd.read_csv(dataset, delimiter=delimiter)
    
    # If target_variable is None, it's likely an unsupervised learning task (clustering)
    if target_variable is None:
        return 'clustering'

    # Check if the target variable exists in the dataset
    if target_variable not in dataset.columns:
        raise ValueError("Target variable not found in the dataset.")

    # Get the data type of the target variable
    target_dtype = dataset[target_variable].dtype

    # If the target variable is numeric and not just 0 and 1, it's likely a regression problem
    if target_dtype in ['int64', 'float64'] and dataset[target_variable].nunique() > 2:
        return 'regression'
    
    # If the target variable is categorical and binary (0 and 1), it's a binary classification problem
    elif target_dtype in ['int64', 'float64'] and dataset[target_variable].nunique() == 2:
        return 'binary_classification'
    
    # If the target variable is categorical and has more than two unique values, it's a multi-class classification problem
    elif target_dtype == 'object' and len(dataset[target_variable].unique()) > 2:
        return 'multi_classification'
    
    else:
        raise ValueError("Unsupported data type or format for the target variable.")

# Example usage:
classificationxD = 'classification_sample.csv'
dataset_type = determine_problem_type(classificationxD, "Remboursement", delimiter=';')
print(dataset_type) #Should return Classification
