
import os,time
from django.conf import settings
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


class LLM:

    def __init__(self):
        self.endpoint = "https://models.github.ai/inference"
        self.model = "openai/gpt-5-chat"
        self.token = settings.GITHUB_TOKEN
        self.client = ChatCompletionsClient(
            endpoint=self.endpoint,
            credential=AzureKeyCredential(self.token),
        )

    def complete(self, system_prompt, user_prompt, temperature=1.0, top_p=1.0, max_tokens=1000):
        response = self.client.complete(
            messages=[
                SystemMessage(system_prompt),
                UserMessage(user_prompt),
            ],
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
            model=self.model
        )
        return response.choices[0].message.content

# Example usage:
llm = LLM()
result = llm.complete("You are a helpful assistant.", "What is the capital of France?")
print(result)

