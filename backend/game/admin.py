from django.contrib import admin
from .models import PlayerProfile, Challenge, GameSession

admin.site.register(PlayerProfile)
admin.site.register(Challenge)
admin.site.register(GameSession)
