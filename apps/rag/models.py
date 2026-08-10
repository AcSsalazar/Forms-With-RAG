from django.db import models
from django.conf import settings

class FormRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    difficulty = models.CharField(max_length=32)
    evaluation_type = models.CharField(max_length=32)
    status = models.CharField(max_length=16, default='queued')
    created_at = models.DateTimeField(auto_now_add=True)

class Document(models.Model):
    form_request = models.ForeignKey(FormRequest, on_delete=models.CASCADE, related_name='documents')
    filename = models.CharField(max_length=255)
    size = models.IntegerField()
    storage_path = models.CharField(max_length=512)
    page_count = models.IntegerField()
    checksum = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_text = models.TextField()
    chunk_index = models.IntegerField()
    metadata = models.JSONField(default=dict)
    embedding_id = models.CharField(max_length=128, blank=True, null=True)

class GeneratedForm(models.Model):
    form_request = models.ForeignKey(FormRequest, on_delete=models.CASCADE, related_name='generated_forms')
    title = models.CharField(max_length=255)
    prompt_version = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    generated_form = models.ForeignKey(GeneratedForm, on_delete=models.CASCADE, related_name='questions')
    index = models.IntegerField()
    question_text = models.TextField()
    choices = models.JSONField(default=list)
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, null=True)
    source_refs = models.JSONField(default=list)

class Submission(models.Model):
    generated_form = models.ForeignKey(GeneratedForm, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answers = models.JSONField(default=dict)
    score = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
