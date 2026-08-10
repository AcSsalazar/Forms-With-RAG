# Handles prompt construction, LLM call, validation, and persistence for question generation
import json
import re

from ..prompts.form_generation_prompt import SYSTEM_PROMPT
from ..repositories.form_repo import FormRepository
from forms.llm_config import LLM


class GenerationService:
    prompt_version = 'v1'

    def __init__(self):
        self.llm = LLM()
        self.form_repo = FormRepository()

    def _build_user_prompt(self, context_chunks):
        lines = []
        for idx, chunk in enumerate(context_chunks, start=1):
            source_ref = chunk.get('source_ref') or chunk.get('source') or f'chunk{idx}'
            text = (chunk.get('text') or '').strip()
            if not text:
                continue
            lines.append(f'[{source_ref}] {text}')
        return '\n\n'.join(lines)

    def _parse_json(self, content):
        content = content.strip()
        if content.startswith('```'):
            content = re.sub(r'^```(?:json)?\s*', '', content)
            content = re.sub(r'\s*```$', '', content)
        return json.loads(content)

    def _validate_payload(self, payload):
        if not isinstance(payload, dict):
            raise ValueError('LLM output must be a JSON object')
        if payload.get('error'):
            raise ValueError(payload['error'])
        questions = payload.get('questions')
        if not isinstance(questions, list) or len(questions) != 20:
            raise ValueError('LLM output must include exactly 20 questions')
        return payload

    def generate_questions(self, context_chunks, config):
        form_request = config['form_request']
        difficulty = form_request.difficulty
        evaluation_type = form_request.evaluation_type

        system_prompt = SYSTEM_PROMPT.format(
            difficulty=difficulty,
            evaluation_type=evaluation_type,
        )
        user_prompt = self._build_user_prompt(context_chunks)
        raw = self.llm.complete(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=config.get('temperature', 0.2),
            top_p=config.get('top_p', 1.0),
            max_tokens=config.get('max_tokens', 4000),
        )

        payload = self._validate_payload(self._parse_json(raw))

        title = payload.get('title') or f'{evaluation_type.title()} {difficulty.title()} Assessment'
        generated_form = self.form_repo.save_generated_form(
            form_request=form_request,
            title=title,
            prompt_version=self.prompt_version,
        )

        saved_questions = []
        for question in payload['questions']:
            saved_questions.append(
                self.form_repo.save_question(
                    generated_form=generated_form,
                    index=question.get('index') or (len(saved_questions) + 1),
                    question_data=question,
                )
            )

        return {
            'generated_form': generated_form,
            'questions': saved_questions,
            'payload': payload,
        }
