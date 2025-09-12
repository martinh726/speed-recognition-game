from rest_framework import serializers
from .models import Challenge, PlayerProfile, GameSession, Category, GameRound

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'icon']

class ChallengeSerializer(serializers.ModelSerializer):
    correct_category = CategorySerializer(read_only=True)
    incorrect_categories = CategorySerializer(many=True, read_only=True)
    all_categories = serializers.SerializerMethodField()
    
    class Meta:
        model = Challenge
        fields = ['id', 'type', 'difficulty', 'prompt', 'correct_category', 
                 'incorrect_categories', 'all_categories', 'points', 'time_limit']
    
    def get_all_categories(self, obj):
        categories = obj.get_all_categories()
        return CategorySerializer(categories, many=True).data

class PlayerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    accuracy_percentage = serializers.ReadOnlyField()
    next_level_xp = serializers.ReadOnlyField()
    avg_reaction_time = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = ['id', 'username', 'high_score', 'total_games_played', 
                 'total_correct_answers', 'best_streak', 'current_streak',
                 'level', 'experience_points', 'avatar', 'accuracy_percentage',
                 'next_level_xp', 'avg_reaction_time']

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
        fields = ('id', 'chosen_category', 'correct', 'reaction_time', 
                 'points_earned', 'timestamp', 'challenge')

    def get_challenge(self, obj):
        return {
            "prompt": obj.challenge.prompt,
            "type": obj.challenge.type,
            "difficulty": obj.challenge.difficulty,
        }

class GameRoundSerializer(serializers.ModelSerializer):
    accuracy_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = GameRound
        fields = ['id', 'start_time', 'end_time', 'total_score', 'total_challenges',
                 'correct_answers', 'average_reaction_time', 'difficulty', 
                 'is_completed', 'accuracy_percentage']