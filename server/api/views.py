from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from transformers import BlipProcessor, BlipForConditionalGeneration
import requests
from PIL import Image
import json
from io import BytesIO

# Load the pre-trained model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

@csrf_exempt
def get_image_description(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            body = json.loads(request.body)
            image_url = body.get('image_url')
            print("Image URL:", image_url)

            if not image_url:
                return JsonResponse({'error': 'No image URL provided'}, status=400)

            # Download the image
            response = requests.get(image_url)
            if response.status_code != 200:
                return JsonResponse({'error': 'Failed to fetch the image from URL'}, status=400)

            image = Image.open(BytesIO(response.content)).convert("RGB")

            # Prepare the image for the model
            inputs = processor(images=image, return_tensors="pt")

            # Generate description with specified length
            out = model.generate(**inputs, max_new_tokens=50)  # Adjust the number as needed.
            description = processor.decode(out[0], skip_special_tokens=True)

            print("Description:", description)
            return JsonResponse({'description': description}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)