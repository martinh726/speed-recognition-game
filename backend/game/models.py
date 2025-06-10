from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone

class PlayerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    high_score = models.IntegerField(default=0)
    average_reaction_time = models.FloatField(default=0.0)
    total_games_played = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
    
class Challenge(models.Model):
    CHALLENGE_TYPES = [
        ('word', 'Word'),
        ('image', 'Image'),
        ('color', 'Color'),
        ('shape', 'Shape'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    prompt = models.CharField(max_length=255)  # e.g., 'Lion', or image URL | The prompt field is the actual thing the user will see and try to identify.


    correct_category = models.CharField(max_length=50)  # e.g., 'Animal'

    def __str__(self):
        return f"{self.type}: {self.prompt}"


class GameSession(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    chosen_category = models.CharField(max_length=50)
    correct = models.BooleanField()
    reaction_time = models.FloatField(help_text="Time in seconds")
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.player.user.username} - {self.challenge.prompt} - {'✔' if self.correct else '✘'}"