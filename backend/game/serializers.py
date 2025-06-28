from rest_framework import serializers
from .models import Challenge
from .models import PlayerProfile
from .models import GameSession

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = '__all__'

class GameSessionSerializer(serializers.Serializer):
    class Meta:
        model = GameSession
        fields = ('player', 'challenge', 'chosen_category', 'correct', 'reaction_time', 'created_at')
