from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Challenge
from .models import PlayerProfile
from .models import GameSession
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
        return Response({ 'error': 'Challenge not found' }, status=404)

    # Check if the answer is correct
    is_correct = (selected_category.lower() == challenge.correct_category.lower())

    return Response({
        'correct': is_correct,
        'correct_category': challenge.correct_category,
        'prompt': challenge.prompt,
    })