from django.views.decorators.csrf import csrf_exempt
import openai
from django.http import JsonResponse
from django.conf import settings
import json

# Ensure the OpenAI API key is set
openai.api_key = settings.OPENAI_API_KEY
print("Api key:", openai.api_key)

@csrf_exempt
def get_image_description(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            body = json.loads(request.body)
            image_url = body.get('image_url')
            print("Img url:", image_url)

            if not image_url:
                return JsonResponse({'error': 'No image URL provided'}, status=400)

            # Use the chat API for GPT-4
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert at describing images."},
                    {"role": "user", "content": f"Describe the image at this URL: {image_url}"}
                ],
                max_tokens=20,
            )

            description = response['choices'][0]['message']['content'].strip()
            return JsonResponse({'description': description}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
