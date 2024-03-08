from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

def classfier_random_forest(data, target_variable, n_estimators=100, max_depth=None, random_state=None):
  
    X = data.drop(columns=[target_variable])
    y = data[target_variable]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state)

    classifier = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=random_state)
    classifier.fit(X_train, y_train)

    y_pred = classifier.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    confusion = confusion_matrix(y_test, y_pred)
    classification_rep = classification_report(y_test, y_pred)

    return {
        "Accuracy": accuracy,
        "Confusion Matrix": confusion,
        "Classification Report": classification_rep,
    }

