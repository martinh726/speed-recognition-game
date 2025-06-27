from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import Challenge, GameSession, PlayerProfile
from django.contrib.auth.models import User
from .serializers import ChallengeSerializer
from .serializers import PlayerProfileSerializer
from .serializers import GameSessionSerializer

@api_view(['GET'])
def get_challenges(request):
    challenges = Challenge.objects.all()
    serializer = ChallengeSerializer(challenges, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_player_profile(request):
    playerProfile = PlayerProfile.objects.all()
    serializer = PlayerProfileSerializer(playerProfile, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def submit_answer(request):
    data = request.data
    challenge_id = data.get('challenge_id')
    selected_category = data.get('selected_category')

    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return Response({'error': 'Challenge not found'}, status=404)

    is_correct = (selected_category.lower() == challenge.correct_category.lower())

    # for now just using first user for testing
    user = request.user if request.user.is_authenticated else User.objects.first()
    player_profile, created = PlayerProfile.objects.get_or_create(user=user)

    # fake reaction time for now will replace later
    import random
    fake_reaction_time = round(random.uniform(0.5, 2.0), 2)

    # Saving the game session
    GameSession.objects.create(
        player=player_profile,
        challenge=challenge,
        chosen_category=selected_category,
        correct=is_correct,
        reaction_time=fake_reaction_time
    )

    return Response({
        'correct': is_correct,
        'correct_category': challenge.correct_category,
        'prompt': challenge.prompt,
        'reaction_time': fake_reaction_time
    })

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request):
    profile, created = PlayerProfile.objects.get_or_create(user=request.user)

    return Response({
        "username": profile.user.username,
        "high_score": profile.high_score,
        "total_games_played": profile.total_games_played
    })
# updates the player's stats after a game session
@api_view(['POST'])  
@permission_classes([IsAuthenticated])  
def update_stats(request):
    user = request.user  
    score = request.data.get('score')  

    try:
        profile = PlayerProfile.objects.get(user=user)
    except PlayerProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    if score > profile.high_score:
        profile.high_score = score

    profile.total_games_played += 1  
    profile.save()  

    return Response({
        "message": "Stats updated!",
        "high_score": profile.high_score,
        "total_games_played": profile.total_games_played
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_history(request):
    player_profile = PlayerProfile.objects.get(user=request.user)
    sessions = GameSession.objects.filter(player=player_profile).order_by('created_at')
    serializer = GameSessionSerializer(sessions, many=True)
    return Response(serializer.data)
