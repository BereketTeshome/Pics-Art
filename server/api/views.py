from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from django.http import JsonResponse
from django.conf import settings
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY)
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

            # Use GPT-4 model
            GPT_MODEL = "gpt-4"
            messages=[
                    {"role": "system", "content": "You are an AI model that describes images accurately and very precisely based on the given image URL."},
                    {"role": "user", "content": f"Please describe the image at this URL: {image_url}"}
                ]
            response = client.chat.completions.create(
                model=GPT_MODEL,
                messages=messages,
                temperature=0,
                max_tokens=60
            )
            description = response.choices[0].message.content
            print("desc:", description)
            return JsonResponse({'description': description}, status=200)


        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
