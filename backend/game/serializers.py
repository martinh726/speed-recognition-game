from rest_framework import serializers
from .models import Challenge
from .models import PlayerProfile
from .models import GameSession

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class PlayerProfileSerializer(serializers.ModelSerializer):
    avg_reaction_time = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = ['id', 'user', 'high_score', 'total_games_played', 'avg_reaction_time']

    def get_avg_reaction_time(self, obj):
        sessions = GameSession.objects.filter(player=obj, correct=True)
        if not sessions.exists():
            return 0.0
        total_time = sum([s.reaction_time for s in sessions])
        return round(total_time / sessions.count(), 2)
    
class GameSessionSerializer(serializers.ModelSerializer):
    challenge = serializers.SerializerMethodField()

    class Meta:
        model = GameSession
        fields = ('id', 'chosen_category', 'correct', 'reaction_time', 'timestamp', 'challenge')

    def get_challenge(self, obj):
        return {
            "prompt": obj.challenge.prompt,
            "type": obj.challenge.type,
        }