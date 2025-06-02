# Basketball Shooting Game (Web Version)

A web-based basketball shooting game converted from the original Python/Pygame version.

## Features

- Orange basketball with realistic physics
- Red hoop with white net
- Three difficulty levels
- Adjustable time limit (default: 1 minute)
- Sound effects for ball bounces, successful shots, and game end

## How to Play

1. Select a level (1-3) from the main menu
2. Adjust the time limit using the up/down buttons in the menu
3. During gameplay:
   - Use UP/DOWN arrow keys to adjust power
   - Use LEFT/RIGHT arrow keys to adjust shooting angle
   - Press SPACE to shoot the ball
   - Press R to reset the ball position
   - Press ESC to return to the menu

## Sound Files

The game looks for the following sound files in the public directory:
- `bounce.wav` - Played when the ball bounces
- `swish.wav` - Played when you score a basket
- `buzzer.wav` - Played when time runs out

If these files are not found, the game will run without sound effects.

## Levels

1. **Level 1 (Easy)**: Larger hoop, normal gravity, no wind
2. **Level 2 (Medium)**: Medium hoop size, increased gravity, slight wind effect
3. **Level 3 (Hard)**: Small hoop, high gravity, stronger wind effect

## Development

This web version was created using HTML5 Canvas and JavaScript.

## Deployment

This game is deployed using AWS Amplify.

## Cost Estimate

Estimated cost for running the application for 24 hours:

### Amazon S3 Costs
- **Storage**: Application files (~135 KB)
   - Essentially negligible (less than $0.01 per month)
- **Requests**: 
   - For moderate traffic (1,000 users per day): ~$0.01-0.02 per day

### Amazon CloudFront Costs
- **Data Transfer Out**: 
   - For 1,000 users downloading 135 KB each: ~$0.01 per day
- **HTTP/HTTPS Requests**:
   - For 1,000 users with multiple requests: ~$0.01 per day

### Total Estimated Cost for 24 Hours
- **Low traffic** (few hundred users): **$0.02-0.05 per day**
- **Moderate traffic** (few thousand users): **$0.10-0.30 per day**
- **High traffic** (tens of thousands of users): **$1-3 per day**

AWS Free Tier benefits may apply for the first 12 months, potentially resulting in no costs for moderate usage.
