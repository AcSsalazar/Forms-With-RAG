from django.db import models
from django.conf import settings
from django.core.mail import send_mail
from ckeditor.fields import RichTextField
from django.utils.text import slugify
from .utils import calculate_category_averages




def images_directory_path(instance, filename):
    title = None
    
    if hasattr(instance, 'title') and instance.title:
        title = instance.title

    elif title:
        ext = filename.split('.')[-1]
        filename = "%s.%s" % (title.id, ext)
        return 'user_{0}/{1}'.format(title.id, filename)
    else:
        # Handle the case when title is None
        # You can return a default path or raise an exception, depending on your requirements.
        # For example, return a path with 'unknown_user' as the user ID:
        ext = filename.split('.')[-1]
        filename = "%s.%s" % ('file', ext)
        return 'title_{0}/{1}'.format('file', filename)
    

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

class DiagnosticLevel(models.Model):
    category_diagnostics = models.ForeignKey(Category, related_name='levels', on_delete=models.CASCADE, null=True)
    level = models.IntegerField()

    def __str__(self):
        return f"{self.level}"

class DiagnosticPlan(models.Model):
    level_diagnostics = models.ForeignKey(DiagnosticLevel, related_name='plans', on_delete=models.CASCADE, null=True)
    text = RichTextField(blank=True, null=True)
    ai_generated_content = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.level_diagnostics.level}"

class Form(models.Model):
    image = models.ImageField(upload_to = 'media/formsimg', blank=True, null=True, help_text="Imagen del formulario")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True, help_text="Descripción del formulario")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    endpoint_url = models.CharField(max_length=255, blank=True, help_text="URL del endpoint (ej: /api/forms/analisis-oportunidades/)")

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.endpoint_url:
            self.endpoint_url = f"/api/forms/{self.slug}/"
        super().save(*args, **kwargs)

    def get_endpoint_url(self):
        """Retorna la URL completa del endpoint"""
        return self.endpoint_url
    
    def update_endpoint(self, new_slug=None):
        """Actualiza el slug y el endpoint URL"""
        if new_slug:
            self.slug = new_slug
        self.endpoint_url = f"/api/forms/{self.slug}/"
        self.save()
    
    class Meta:
        verbose_name = 'Formulario'
        verbose_name_plural = 'Formularios'

class Question(models.Model):
    form = models.ForeignKey(Form, related_name='questions', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    category = models.ForeignKey(Category, related_name='questions', on_delete=models.SET_NULL, null=True, blank=True)
    sub_category = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.text} ({self.category}) [{self.sub_category}]"

    class Meta:
        ordering = ['order']

class Answer(models.Model):
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    text = models.CharField(max_length=510)
    value = models.IntegerField()

    def __str__(self):
        return f"{self.text} ({self.value})"

class FormResponse(models.Model):
    form = models.ForeignKey(Form, related_name='responses', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.form.title} - {self.user} - {self.created_at}"

    class Meta:
        verbose_name = 'Respuesta de formulario'
        verbose_name_plural = 'Respuestas de formularios'
        ordering = ['-created_at']

class CompletedForm(models.Model):
    user = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    form_title = models.CharField(max_length=255)
    content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.form_title} - {self.user} - {self.email}"

    class Meta:
        verbose_name = 'Formulario completado'
        verbose_name_plural = 'Formularios completados'
        ordering = ['-created_at']
    
class CompletedFormProxy(CompletedForm):
    class Meta:
        proxy = True
        verbose_name = 'Descarga la base de datos completa'
        verbose_name_plural = 'Descarga la base de datos completa'