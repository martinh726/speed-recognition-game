from django.urls import path
from .views import get_challenges
from .views import get_player_profile
from .views import submit_answer

urlpatterns = [
    path('challenges/', get_challenges),
    path('player-profile/', get_player_profile),
    path('submit/', submit_answer),
]
