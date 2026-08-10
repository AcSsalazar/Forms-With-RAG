from rest_framework import serializers
from ..models import FormRequest, Document, DocumentChunk, GeneratedForm, Question, Submission

class FormRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at')

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = '__all__'

class GeneratedFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedForm
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'
