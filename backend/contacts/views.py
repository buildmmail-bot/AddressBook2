from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Contact
import json

# ✅ ADD THESE IMPORTS
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login


# ===================== CONTACT LIST =====================
@csrf_exempt
def contact_list(request):
    if request.method == "GET":
        data = list(Contact.objects.values())
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        emails = data.get("emails", [])
        # ✅ FIXED (store in variable)
        contact = Contact.objects.create(
            name=data.get("name"),
            emails=emails,
            phone=data.get("phone"),
            company_name=data.get("company_name"),
            address=data.get("address", ""),
            pin = data.get("pin", ""),
            github = data.get("github", ""),
            linkedin = data.get("linkedin", ""),
            website = data.get("website", ""),
            front_card=request.FILES.get("front_card"),
            back_card=request.FILES.get("back_card"),
        )

        return JsonResponse({"message": "Saved", "id": contact.id})


# ===================== CONTACT DETAIL =====================
@csrf_exempt
def contact_detail(request, id):
    try:
        contact = Contact.objects.get(id=id)
    except Contact.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    if request.method == "DELETE":
        contact.delete()
        return JsonResponse({"message": "Deleted"})

    elif request.method == "PUT":
        data = json.loads(request.body.decode('utf-8'))
        print("DATA RECEIVED:", data)

        contact.name = data.get("name", contact.name)
        contact.emails = data.get("emails", contact.emails)
        contact.phone = data.get("phone", contact.phone)
        contact.company_name = data.get("company_name", contact.company_name)
        contact.address = data.get("address", contact.address)
        contact.pin = data.get("pin", contact.pin)
        contact.github = data.get("github", contact.github)
        contact.linkedin = data.get("linkedin", contact.linkedin)
        contact.website = data.get("website", contact.website)

        contact.save()
        return JsonResponse({"message": "Updated"})


# ===================== LOGIN / REGISTER =====================
@csrf_exempt

def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        user = authenticate(username=email, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful"})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

    # ✅ Handle GET requests (fixes the None error)
    return JsonResponse({"message": "Login endpoint is active"})
@csrf_exempt
def register_admin(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return JsonResponse({"error": "Email and password required"}, status=400)

        if User.objects.filter(username=email).exists():
            return JsonResponse({"error": "Admin with this email already exists"}, status=400)

        User.objects.create_user(username=email, email=email, password=password)
        return JsonResponse({"message": "Admin added successfully"})

    return JsonResponse({"message": "Register endpoint active"})