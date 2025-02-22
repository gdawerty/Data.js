import os
import openai

# Set your API key from an environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

completion = openai.ChatCompletion.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "write a haiku about ai"}
    ]
)

# Print the content of the response
print(completion.choices[0].message['content'])
