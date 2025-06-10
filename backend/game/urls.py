from django.urls import path
from .views import get_challenges
from .views import get_player_profile

urlpatterns = [
    path('challenges/', get_challenges),
    path('player-profile/', get_player_profile),
]
