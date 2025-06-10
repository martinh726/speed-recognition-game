from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Challenge
from .models import PlayerProfile
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