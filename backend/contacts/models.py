from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=100)
    emails = models.JSONField(default=list)
    phone = models.CharField(max_length=20)
    company_name = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    pin = models.CharField(max_length=10, blank=True, default="")
    github = models.CharField(max_length=100, blank=True, default="")
    linkedin = models.CharField(max_length=200, blank=True, default="")
    website = models.CharField(max_length=200, blank=True, default="")
    front_card = models.ImageField(upload_to="cards/front/", blank=True, null=True)
    back_card = models.ImageField(upload_to="cards/back/", blank=True, null=True)



    def __str__(self):
        return self.name