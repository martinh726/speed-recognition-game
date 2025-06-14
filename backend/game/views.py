from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Challenge, GameSession, PlayerProfile
from django.contrib.auth.models import User
from .serializers import ChallengeSerializer
from .serializers import PlayerProfileSerializer

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

    # Saveing the game session
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