from django.urls import path
from .views import contact_list, contact_detail, login_view,register_admin

urlpatterns = [
    path('contacts/', contact_list),             # GET + POST
    path('contacts/<int:id>/', contact_detail),# DELETE
    path('login/', login_view),
    path('register-admin/', register_admin)
]