from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import Challenge, GameSession, PlayerProfile, Category, GameRound
from django.contrib.auth.models import User
from .serializers import (ChallengeSerializer, PlayerProfileSerializer, 
                         GameSessionSerializer, CategorySerializer, GameRoundSerializer)
import random
import time
from django.utils import timezone

# Category endpoints
@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# Challenge endpoints
@api_view(['GET'])
def get_challenges(request):
    difficulty = request.GET.get('difficulty', 'easy')
    challenge_type = request.GET.get('type', None)
    limit = int(request.GET.get('limit', 10))
    
    challenges = Challenge.objects.filter(is_active=True, difficulty=difficulty)
    
    if challenge_type:
        challenges = challenges.filter(type=challenge_type)
    
    # Randomize and limit
    challenges = list(challenges)
    random.shuffle(challenges)
    challenges = challenges[:limit]
    
    serializer = ChallengeSerializer(challenges, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_random_challenge(request):
    difficulty = request.GET.get('difficulty', 'easy')
    challenge_type = request.GET.get('type', None)
    
    challenges = Challenge.objects.filter(is_active=True, difficulty=difficulty)
    
    if challenge_type:
        challenges = challenges.filter(type=challenge_type)
    
    if challenges.exists():
        challenge = random.choice(challenges)
        serializer = ChallengeSerializer(challenge)
        return Response(serializer.data)
    else:
        return Response({'error': 'No challenges found'}, status=404)

# Player profile endpoints
@api_view(['GET'])
def get_player_profiles(request):
    profiles = PlayerProfile.objects.all().order_by('-high_score')[:10]
    serializer = PlayerProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user_profile(request):
    profile, created = PlayerProfile.objects.get_or_create(user=request.user)
    serializer = PlayerProfileSerializer(profile)
    return Response(serializer.data)

# Game session endpoints
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    data = request.data
    challenge_id = data.get('challenge_id')
    selected_category = data.get('selected_category')
    reaction_time = data.get('reaction_time', 0)
    game_round_id = data.get('game_round_id')

    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return Response({'error': 'Challenge not found'}, status=404)

    player_profile, created = PlayerProfile.objects.get_or_create(user=request.user)
    
    # Check if answer is correct
    is_correct = (selected_category.lower() == challenge.correct_category.name.lower())
    
    # Calculate points based on reaction time and correctness
    points_earned = 0
    if is_correct:
        # Faster reactions get more points
        time_bonus = max(0, challenge.time_limit - reaction_time)
        points_earned = challenge.points + int(time_bonus * 10)
        
        # Update streak
        player_profile.current_streak += 1
        if player_profile.current_streak > player_profile.best_streak:
            player_profile.best_streak = player_profile.current_streak
    else:
        player_profile.current_streak = 0

    # Update player stats
    player_profile.total_games_played += 1
    if is_correct:
        player_profile.total_correct_answers += 1
        player_profile.experience_points += points_earned
        
        # Check for level up
        while player_profile.experience_points >= player_profile.next_level_xp:
            player_profile.level += 1
            player_profile.experience_points -= player_profile.next_level_xp

    player_profile.save()

    # Save game session
    game_session = GameSession.objects.create(
        player=player_profile,
        challenge=challenge,
        chosen_category=selected_category,
        correct=is_correct,
        reaction_time=reaction_time,
        points_earned=points_earned
    )

    # Update game round if provided
    if game_round_id:
        try:
            game_round = GameRound.objects.get(id=game_round_id, player=player_profile)
            game_round.total_challenges += 1
            if is_correct:
                game_round.correct_answers += 1
                game_round.total_score += points_earned
            game_round.save()
        except GameRound.DoesNotExist:
            pass

    return Response({
        'correct': is_correct,
        'correct_category': challenge.correct_category.name,
        'prompt': challenge.prompt,
        'reaction_time': reaction_time,
        'points_earned': points_earned,
        'new_level': player_profile.level,
        'current_streak': player_profile.current_streak
    })

# Game round endpoints
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_game_round(request):
    difficulty = request.data.get('difficulty', 'easy')
    player_profile, created = PlayerProfile.objects.get_or_create(user=request.user)
    
    game_round = GameRound.objects.create(
        player=player_profile,
        difficulty=difficulty
    )
    
    serializer = GameRoundSerializer(game_round)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def end_game_round(request):
    game_round_id = request.data.get('game_round_id')
    
    try:
        game_round = GameRound.objects.get(id=game_round_id, player__user=request.user)
    except GameRound.DoesNotExist:
        return Response({'error': 'Game round not found'}, status=404)
    
    game_round.end_time = timezone.now()
    game_round.is_completed = True
    
    # Calculate average reaction time
    sessions = GameSession.objects.filter(
        player=game_round.player,
        timestamp__gte=game_round.start_time
    )
    if sessions.exists():
        total_time = sum(s.reaction_time for s in sessions)
        game_round.average_reaction_time = total_time / sessions.count()
    
    game_round.save()
    
    # Update player high score
    player_profile = game_round.player
    if game_round.total_score > player_profile.high_score:
        player_profile.high_score = game_round.total_score
        player_profile.save()
    
    serializer = GameRoundSerializer(game_round)
    return Response(serializer.data)

# User registration and authentication
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    avatar = request.data.get('avatar', '🎮')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    PlayerProfile.objects.create(user=user, avatar=avatar)
    
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request):
    profile, created = PlayerProfile.objects.get_or_create(user=request.user)
    serializer = PlayerProfileSerializer(profile)
    return Response(serializer.data)

# Game history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_history(request):
    player_profile = PlayerProfile.objects.get(user=request.user)
    sessions = GameSession.objects.filter(player=player_profile).order_by('-timestamp')[:20]
    serializer = GameSessionSerializer(sessions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def game_rounds_history(request):
    player_profile = PlayerProfile.objects.get(user=request.user)
    rounds = GameRound.objects.filter(player=player_profile, is_completed=True).order_by('-end_time')[:10]
    serializer = GameRoundSerializer(rounds, many=True)
    return Response(serializer.data)
