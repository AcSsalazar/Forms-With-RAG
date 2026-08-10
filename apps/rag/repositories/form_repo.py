# Handles DB access for GeneratedForm and Question
from ..models import GeneratedForm, Question


class FormRepository:
    def save_generated_form(self, form_request, title, prompt_version):
        return GeneratedForm.objects.create(
            form_request=form_request,
            title=title,
            prompt_version=prompt_version,
        )

    def save_question(self, generated_form, index, question_data):
        return Question.objects.create(
            generated_form=generated_form,
            index=index,
            question_text=question_data.get('question') or question_data.get('question_text', ''),
            choices=question_data.get('choices', []),
            correct_answer=question_data.get('correct_answer', ''),
            explanation=question_data.get('justification') or question_data.get('explanation', ''),
            source_refs=question_data.get('source_refs', []),
        )
