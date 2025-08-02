from rest_framework import serializers
from .models import Form, Question, Answer, CompletedForm, Category, DiagnosticLevel, DiagnosticPlan, FormResponse

class DiagnosticPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosticPlan
        fields = ['text']

class DiagnosticLevelSerializer(serializers.ModelSerializer):
    plans = DiagnosticPlanSerializer(many=True, read_only=True)
    class Meta:
        model = DiagnosticLevel
        fields = ['level', 'plans']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'value']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    answers_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'category', 'sub_category', 'answers', 'answers_count']
    
    def get_answers_count(self, obj):
        # Retorna el número de respuestas asociadas a la pregunta
        return obj.answers.count()

class FormSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Form
        fields = ['id', 'title', 'questions', 'slug']

class CompletedFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedForm
        fields = ['id', 'user', 'email', 'form_title', 'created_at', 'content']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        for answer in representation.get('content', {}).get('answers', []):
            category = answer.get('category', None)
            if category:
                # Asegúrate de que 'levels' no se esté intentando usar o acceder
                if 'levels' in category:
                    del category['levels']
                answer['category'] = CategorySerializer(instance=Category.objects.get(slug=category['slug'])).data
        return representation
    
class CategoryPlanSerializer(serializers.ModelSerializer):
    levels = DiagnosticLevelSerializer(many=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'levels']

class FormResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormResponse
        fields = ['id', 'form', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)