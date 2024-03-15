from flask import Flask, jsonify, request
from aws_lambda import invoke

app = Flask(__name__)

@app.route('/invoke_lambda', methods=['POST'])
def invoke_lambda():
    try:
        # Extract data from request
        data = request.json
        
        # Invoke Lambda function
        result = invoke(
            function_name='YOUR_LAMBDA_FUNCTION_NAME',
            invocation_type='RequestResponse',
            payload=data
        )
        
        # Return the result
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

