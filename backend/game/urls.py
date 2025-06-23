from django.urls import path
from .views import get_challenges
from .views import get_player_profile
from .views import submit_answer
from .views import register_user
from .views import get_logged_in_user


urlpatterns = [
    path('challenges/', get_challenges),
    path('player-profile/', get_player_profile),
    path('submit/', submit_answer),
    path('register/', register_user),
    path('current-user/', get_logged_in_user),
]
