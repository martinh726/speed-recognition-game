from django.core.management.base import BaseCommand
from game.models import Category, Challenge
import random

class Command(BaseCommand):
    help = 'Populate the database with sample categories and challenges'

    def handle(self, *args, **options):
        self.stdout.write('Creating categories...')
        
        # Create categories
        categories_data = [
            {'name': 'Animal', 'color': '#FF6B6B', 'icon': '🐾'},
            {'name': 'Food', 'color': '#4ECDC4', 'icon': '🍎'},
            {'name': 'Vehicle', 'color': '#45B7D1', 'icon': '🚗'},
            {'name': 'Color', 'color': '#96CEB4', 'icon': '🎨'},
            {'name': 'Shape', 'color': '#FFEAA7', 'icon': '🔷'},
            {'name': 'Emoji', 'color': '#DDA0DD', 'icon': '😀'},
            {'name': 'Number', 'color': '#98D8C8', 'icon': '🔢'},
            {'name': 'Object', 'color': '#F7DC6F', 'icon': '📦'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'color': cat_data['color'], 'icon': cat_data['icon']}
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(f'Created category: {category.name}')

        self.stdout.write('Creating challenges...')
        
        # Create challenges
        challenges_data = [
            # Animal challenges
            {'prompt': 'Lion', 'type': 'word', 'correct_category': 'Animal', 'difficulty': 'easy'},
            {'prompt': 'Elephant', 'type': 'word', 'correct_category': 'Animal', 'difficulty': 'easy'},
            {'prompt': 'Dolphin', 'type': 'word', 'correct_category': 'Animal', 'difficulty': 'easy'},
            {'prompt': 'Butterfly', 'type': 'word', 'correct_category': 'Animal', 'difficulty': 'medium'},
            {'prompt': 'Rhinoceros', 'type': 'word', 'correct_category': 'Animal', 'difficulty': 'hard'},
            {'prompt': '🦁', 'type': 'emoji', 'correct_category': 'Animal', 'difficulty': 'easy'},
            {'prompt': '🐘', 'type': 'emoji', 'correct_category': 'Animal', 'difficulty': 'easy'},
            {'prompt': '🐬', 'type': 'emoji', 'correct_category': 'Animal', 'difficulty': 'easy'},
            {'prompt': '🦋', 'type': 'emoji', 'correct_category': 'Animal', 'difficulty': 'medium'},
            
            # Food challenges
            {'prompt': 'Pizza', 'type': 'word', 'correct_category': 'Food', 'difficulty': 'easy'},
            {'prompt': 'Banana', 'type': 'word', 'correct_category': 'Food', 'difficulty': 'easy'},
            {'prompt': 'Strawberry', 'type': 'word', 'correct_category': 'Food', 'difficulty': 'medium'},
            {'prompt': 'Avocado', 'type': 'word', 'correct_category': 'Food', 'difficulty': 'medium'},
            {'prompt': 'Quinoa', 'type': 'word', 'correct_category': 'Food', 'difficulty': 'hard'},
            {'prompt': '🍕', 'type': 'emoji', 'correct_category': 'Food', 'difficulty': 'easy'},
            {'prompt': '🍌', 'type': 'emoji', 'correct_category': 'Food', 'difficulty': 'easy'},
            {'prompt': '🍓', 'type': 'emoji', 'correct_category': 'Food', 'difficulty': 'easy'},
            {'prompt': '🥑', 'type': 'emoji', 'correct_category': 'Food', 'difficulty': 'medium'},
            
            # Vehicle challenges
            {'prompt': 'Car', 'type': 'word', 'correct_category': 'Vehicle', 'difficulty': 'easy'},
            {'prompt': 'Airplane', 'type': 'word', 'correct_category': 'Vehicle', 'difficulty': 'easy'},
            {'prompt': 'Motorcycle', 'type': 'word', 'correct_category': 'Vehicle', 'difficulty': 'medium'},
            {'prompt': 'Helicopter', 'type': 'word', 'correct_category': 'Vehicle', 'difficulty': 'medium'},
            {'prompt': '🚗', 'type': 'emoji', 'correct_category': 'Vehicle', 'difficulty': 'easy'},
            {'prompt': '✈️', 'type': 'emoji', 'correct_category': 'Vehicle', 'difficulty': 'easy'},
            {'prompt': '🏍️', 'type': 'emoji', 'correct_category': 'Vehicle', 'difficulty': 'medium'},
            {'prompt': '🚁', 'type': 'emoji', 'correct_category': 'Vehicle', 'difficulty': 'medium'},
            
            # Color challenges
            {'prompt': 'Red', 'type': 'color', 'correct_category': 'Color', 'difficulty': 'easy'},
            {'prompt': 'Blue', 'type': 'color', 'correct_category': 'Color', 'difficulty': 'easy'},
            {'prompt': 'Green', 'type': 'color', 'correct_category': 'Color', 'difficulty': 'easy'},
            {'prompt': 'Purple', 'type': 'color', 'correct_category': 'Color', 'difficulty': 'medium'},
            {'prompt': 'Orange', 'type': 'color', 'correct_category': 'Color', 'difficulty': 'medium'},
            {'prompt': 'Turquoise', 'type': 'color', 'correct_category': 'Color', 'difficulty': 'hard'},
            
            # Shape challenges
            {'prompt': 'Circle', 'type': 'shape', 'correct_category': 'Shape', 'difficulty': 'easy'},
            {'prompt': 'Square', 'type': 'shape', 'correct_category': 'Shape', 'difficulty': 'easy'},
            {'prompt': 'Triangle', 'type': 'shape', 'correct_category': 'Shape', 'difficulty': 'easy'},
            {'prompt': 'Diamond', 'type': 'shape', 'correct_category': 'Shape', 'difficulty': 'medium'},
            {'prompt': 'Hexagon', 'type': 'shape', 'correct_category': 'Shape', 'difficulty': 'hard'},
            {'prompt': '🔴', 'type': 'emoji', 'correct_category': 'Shape', 'difficulty': 'easy'},
            {'prompt': '🔵', 'type': 'emoji', 'correct_category': 'Shape', 'difficulty': 'easy'},
            {'prompt': '🟢', 'type': 'emoji', 'correct_category': 'Shape', 'difficulty': 'easy'},
            
            # Number challenges
            {'prompt': '7', 'type': 'number', 'correct_category': 'Number', 'difficulty': 'easy'},
            {'prompt': '42', 'type': 'number', 'correct_category': 'Number', 'difficulty': 'easy'},
            {'prompt': '100', 'type': 'number', 'correct_category': 'Number', 'difficulty': 'easy'},
            {'prompt': '999', 'type': 'number', 'correct_category': 'Number', 'difficulty': 'medium'},
            {'prompt': '1234', 'type': 'number', 'correct_category': 'Number', 'difficulty': 'hard'},
            
            # Object challenges
            {'prompt': 'Book', 'type': 'word', 'correct_category': 'Object', 'difficulty': 'easy'},
            {'prompt': 'Phone', 'type': 'word', 'correct_category': 'Object', 'difficulty': 'easy'},
            {'prompt': 'Laptop', 'type': 'word', 'correct_category': 'Object', 'difficulty': 'medium'},
            {'prompt': '📚', 'type': 'emoji', 'correct_category': 'Object', 'difficulty': 'easy'},
            {'prompt': '📱', 'type': 'emoji', 'correct_category': 'Object', 'difficulty': 'easy'},
            {'prompt': '💻', 'type': 'emoji', 'correct_category': 'Object', 'difficulty': 'easy'},
        ]
        
        created_count = 0
        for challenge_data in challenges_data:
            correct_category = categories[challenge_data['correct_category']]
            
            # Get some incorrect categories for this challenge
            all_categories = list(categories.values())
            incorrect_categories = [cat for cat in all_categories if cat != correct_category]
            selected_incorrect = random.sample(incorrect_categories, min(3, len(incorrect_categories)))
            
            challenge, created = Challenge.objects.get_or_create(
                prompt=challenge_data['prompt'],
                type=challenge_data['type'],
                defaults={
                    'correct_category': correct_category,
                    'difficulty': challenge_data['difficulty'],
                    'points': 10 if challenge_data['difficulty'] == 'easy' else 15 if challenge_data['difficulty'] == 'medium' else 20,
                    'time_limit': 5.0 if challenge_data['difficulty'] == 'easy' else 4.0 if challenge_data['difficulty'] == 'medium' else 3.0,
                }
            )
            
            if created:
                challenge.incorrect_categories.set(selected_incorrect)
                created_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} challenges!')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Total categories: {Category.objects.count()}')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Total challenges: {Challenge.objects.count()}')
        )
