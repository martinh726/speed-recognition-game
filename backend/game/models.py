from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default="#3B82F6")  # Hex color for UI
    icon = models.CharField(max_length=50, default="📦")  # Emoji icon
    
    def __str__(self):
        return self.name

class PlayerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    high_score = models.IntegerField(default=0)
    average_reaction_time = models.FloatField(default=0.0)
    total_games_played = models.IntegerField(default=0)
    total_correct_answers = models.IntegerField(default=0)
    best_streak = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    experience_points = models.IntegerField(default=0)
    avatar = models.CharField(max_length=50, default="🎮")
    
    def __str__(self):
        return self.user.username
    
    @property
    def accuracy_percentage(self):
        if self.total_games_played == 0:
            return 0
        return round((self.total_correct_answers / self.total_games_played) * 100, 1)
    
    @property
    def next_level_xp(self):
        return self.level * 100

class Challenge(models.Model):
    CHALLENGE_TYPES = [
        ('word', 'Word Recognition'),
        ('image', 'Image Recognition'),
        ('color', 'Color Recognition'),
        ('shape', 'Shape Recognition'),
        ('emoji', 'Emoji Recognition'),
        ('number', 'Number Recognition'),
    ]

    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS, default='easy')
    prompt = models.CharField(max_length=255)
    correct_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='correct_challenges')
    incorrect_categories = models.ManyToManyField(Category, related_name='incorrect_challenges', blank=True)
    points = models.IntegerField(default=10)
    time_limit = models.FloatField(default=5.0, help_text="Time limit in seconds")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.type}: {self.prompt}"

    def get_all_categories(self):
        """Return all possible categories for this challenge"""
        categories = [self.correct_category]
        categories.extend(self.incorrect_categories.all())
        return categories

class GameSession(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    chosen_category = models.CharField(max_length=50)
    correct = models.BooleanField()
    reaction_time = models.FloatField(help_text="Time in seconds")
    points_earned = models.IntegerField(default=0)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.player.user.username} - {self.challenge.prompt} - {'✔' if self.correct else '✘'}"

class GameRound(models.Model):
    """Represents a complete game session with multiple challenges"""
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_score = models.IntegerField(default=0)
    total_challenges = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    average_reaction_time = models.FloatField(default=0.0)
    difficulty = models.CharField(max_length=10, choices=Challenge.DIFFICULTY_LEVELS, default='easy')
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.player.user.username} - Round {self.id} - Score: {self.total_score}"

    @property
    def accuracy_percentage(self):
        if self.total_challenges == 0:
            return 0
        return round((self.correct_answers / self.total_challenges) * 100, 1)