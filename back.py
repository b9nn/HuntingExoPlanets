from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# load model and associated objects
model = joblib.load("exoai_stacking_model.pkl")
scaler = joblib.load("exoai_scaler.pkl") # scales feature ranges to be relative to eachother
encoder = joblib.load("exoai_label_encoder.pkl") # encodes targte labels

@app.route("/")
def home():
    return "api is live"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # get json
        data = request.get_json()

        # validate input
        if not data:
            return jsonify({"Error" : "No input found"}), 400
        
        # extract
        features = data.get("features")
        
        if not features:
            return jsonify({"Error" : "Missing 'features' field"}), 400
        
        # load features
        X = np.array(features).reshape(1, -1) # model expects 2d array, reshape into 1 row, -1 tells numpy to figure out how many features in that array
        #  np.array([365.2, 1.2, 11.5, 5000, 0.98]).reshape(1, -1).shape ----> (1, 5) 1 sample, 5 features

        # apply scaling
        if scaler:
            X = scaler.transform(X)

        # run model
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X).max() # take one with highest confidence

        # result
        return jsonify({"prediction" : str(prediction), "confidence" : float(probability)})
    
    except Exception as e:
        # error
        return jsonify({"Error:" : str(e)}), 500

        
if __name__ == "__main__":
    app.run()