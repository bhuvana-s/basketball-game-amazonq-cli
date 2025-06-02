# Basketball Shooting Game

A simple basketball shooting game created with Python and Pygame.

## Features

- Orange basketball with realistic physics
- Red hoop with white net
- Three difficulty levels
- Adjustable time limit (default: 1 minute)
- Sound effects for ball bounces, successful shots, and game end

## How to Play

1. Select a level (1-3) from the main menu
2. Adjust the time limit using UP/DOWN arrow keys in the menu
3. During gameplay:
   - Use UP/DOWN arrow keys to adjust power
   - Use LEFT/RIGHT arrow keys to adjust shooting angle
   - Press SPACE to shoot the ball
   - Press R to reset the ball position
   - Press ESC to return to the menu

## Sound Files

The game looks for the following sound files in the game directory:
- `bounce.wav` - Played when the ball bounces
- `swish.wav` - Played when you score a basket
- `buzzer.wav` - Played when time runs out

If these files are not found, the game will run without sound effects.

## Levels

1. **Level 1 (Easy)**: Larger hoop, normal gravity, no wind
2. **Level 2 (Medium)**: Medium hoop size, increased gravity, slight wind effect
3. **Level 3 (Hard)**: Small hoop, high gravity, stronger wind effect

## Requirements

- Python 3.x
- Pygame library

## Installation

1. Make sure you have Python installed
2. Install Pygame: `pip install pygame`
3. Run the game: `python basketball_game.py`
