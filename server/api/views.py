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
            GPT_MODEL = "gpt-4o"
            messages=[
                    {"role": "system", "content": "You are an AI model that describes images accurately and precisely based on the given image URL. If you can not read the url correctly just do your own generic explanation so that you won't get wrong"},
                    {"role": "user", "content": f"If possible please describe the image at this URL: {image_url} If you can not read the url do your own image description but make it generic to not get wrong about the image"}
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
