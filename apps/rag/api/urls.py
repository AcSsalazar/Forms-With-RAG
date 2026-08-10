from rest_framework.routers import DefaultRouter
from .views import FormRequestViewSet, GeneratedFormViewSet, SubmissionViewSet

router = DefaultRouter()
router.register(r'form-requests', FormRequestViewSet, basename='formrequest')
router.register(r'forms', GeneratedFormViewSet, basename='generatedform')
router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = router.urls
