from django.urls import path
from .views import (
    get_categories, get_challenges, get_random_challenge,
    get_player_profiles, get_current_user_profile,
    submit_answer, start_game_round, end_game_round,
    register_user, get_logged_in_user,
    game_history, game_rounds_history
)

urlpatterns = [
    # Category endpoints
    path('categories/', get_categories),
    
    # Challenge endpoints
    path('challenges/', get_challenges),
    path('challenges/random/', get_random_challenge),
    
    # Player profile endpoints
    path('player-profiles/', get_player_profiles),
    path('current-user/', get_current_user_profile),
    
    # Game session endpoints
    path('submit/', submit_answer),
    path('start-round/', start_game_round),
    path('end-round/', end_game_round),
    
    # User authentication
    path('register/', register_user),
    
    # Game history
    path('game-history/', game_history),
    path('game-rounds-history/', game_rounds_history),
]
