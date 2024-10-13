from django.views.decorators.csrf import csrf_exempt
import json
import requests
from PIL import Image
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from django.http import JsonResponse
from io import BytesIO

# Load MobileNetV2
model = MobileNetV2(weights='imagenet')

@csrf_exempt
def get_image_description(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)  # Parse the incoming JSON
            image_url = body.get('image_url')  # Get the image URL from the body
            
            print("url: ", image_url)  # Debug print for the URL
            
            if not image_url:
                return JsonResponse({'error': 'No image URL provided'}, status=400)

            # Download the image
            response = requests.get(image_url)
            if response.status_code != 200:
                return JsonResponse({'error': 'Failed to fetch the image from URL'}, status=400)

            image = Image.open(BytesIO(response.content)).resize((224, 224))
            image_array = np.array(image)

            # Preprocess the image for MobileNet
            image_array = preprocess_input(image_array)
            image_array = np.expand_dims(image_array, axis=0)

            # Predict the class probabilities
            predictions = model.predict(image_array)
            
            # Decode the predictions
            decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=3)[0]
            
            # Create a description based on the predictions
            description = ', '.join([f"{label} ({prob:.2f})" for (_, label, prob) in decoded_predictions])
            return JsonResponse({'description': description})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)