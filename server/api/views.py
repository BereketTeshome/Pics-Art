from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from transformers import BlipProcessor, BlipForConditionalGeneration
import requests
from PIL import Image
import json
from io import BytesIO
import logging
logger = logging.getLogger(__name__)

# Load the pre-trained model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

@csrf_exempt
def get_image_description(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            image_url = body.get('image_url')
            logger.info(f"Received request with image URL: {image_url}")

            if not image_url:
                return JsonResponse({'error': 'No image URL provided'}, status=400)

            response = requests.get(image_url, timeout=30)  # Increase the timeout here
            logger.info(f"Image fetch status code: {response.status_code}")

            if response.status_code != 200:
                logger.error(f"Failed to fetch image. Status code: {response.status_code}")
                return JsonResponse({'error': 'Failed to fetch the image from URL'}, status=400)

            image = Image.open(BytesIO(response.content)).convert("RGB")
            logger.info("Image fetched and converted")

            inputs = processor(images=image, return_tensors="pt")
            logger.info("Image processed")

            out = model.generate(**inputs, max_new_tokens=50)
            description = processor.decode(out[0], skip_special_tokens=True)

            logger.info(f"Generated description: {description}")
            return JsonResponse({'description': description}, status=200)

        except requests.exceptions.Timeout:
            logger.error("Image fetch timed out")
            return JsonResponse({'error': 'Image fetch timed out'}, status=504)

        except json.JSONDecodeError:
            logger.error("Invalid JSON data")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
