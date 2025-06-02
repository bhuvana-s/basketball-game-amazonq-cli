import pygame
import sys
import math
import random
import os

# Initialize pygame
pygame.init()
pygame.mixer.init()

# Screen dimensions
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Basketball Shooting Game")

# Colors
ORANGE = (255, 140, 0)  # Basketball color
RED = (255, 0, 0)       # Hoop color
WHITE = (255, 255, 255) # Net color
BLACK = (0, 0, 0)       # Background
BLUE = (135, 206, 235)  # Sky blue for background
GREEN = (0, 128, 0)     # For level indicator

# Sound effects
try:
    bounce_sound = pygame.mixer.Sound(os.path.join("bounce.wav"))
    swish_sound = pygame.mixer.Sound(os.path.join("swish.wav"))
    buzzer_sound = pygame.mixer.Sound(os.path.join("buzzer.wav"))
except:
    print("Sound files not found. Creating game without sound effects.")
    bounce_sound = None
    swish_sound = None
    buzzer_sound = None

# Game variables
ball_radius = 30
ball_pos = [WIDTH // 4, HEIGHT - 100]
ball_velocity = [0, 0]
gravity = 0.5
power = 0
angle = 45
shooting = False
score = 0
attempts = 0
game_time = 60  # 1 minute in seconds (adjustable)
start_time = 0
game_active = False
level = 1  # Current level (1, 2, or 3)

# Level settings
level_settings = {
    1: {"hoop_width": 100, "gravity": 0.5, "wind": 0},
    2: {"hoop_width": 80, "gravity": 0.6, "wind": 0.1},
    3: {"hoop_width": 60, "gravity": 0.7, "wind": 0.2}
}

# Hoop dimensions (will be updated based on level)
hoop_width = level_settings[level]["hoop_width"]
hoop_height = 10
hoop_pos = [WIDTH - 150, HEIGHT // 2]
net_points = []

# Generate net points
def generate_net_points():
    global net_points
    net_points = []
    for i in range(6):
        net_points.append([hoop_pos[0] + 10 + i * (hoop_width/6), hoop_pos[1]])
        net_points.append([hoop_pos[0] + 10 + i * (hoop_width/6), hoop_pos[1] + 60])

generate_net_points()

# Game loop
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 36)

def reset_ball():
    global ball_pos, ball_velocity, shooting
    ball_pos = [WIDTH // 4, HEIGHT - 100]
    ball_velocity = [0, 0]
    shooting = False

def draw_power_meter():
    pygame.draw.rect(screen, (255, 0, 0), (50, 50, power * 2, 20))
    pygame.draw.rect(screen, (0, 0, 0), (50, 50, 200, 20), 2)

def check_score():
    global score, attempts
    # Check if ball passes through the hoop
    if (hoop_pos[0] <= ball_pos[0] <= hoop_pos[0] + hoop_width and 
        hoop_pos[1] <= ball_pos[1] <= hoop_pos[1] + 10 and
        ball_velocity[1] > 0):
        score += 1
        if swish_sound:
            swish_sound.play()
        return True
    return False

def set_level(new_level):
    global level, gravity, hoop_width, hoop_pos
    level = new_level
    gravity = level_settings[level]["gravity"]
    hoop_width = level_settings[level]["hoop_width"]
    # Adjust hoop position based on level
    if level == 1:
        hoop_pos = [WIDTH - 150, HEIGHT // 2]
    elif level == 2:
        hoop_pos = [WIDTH - 150, HEIGHT // 2 - 50]
    else:
        hoop_pos = [WIDTH - 150, HEIGHT // 2 - 100]
    generate_net_points()

def start_game():
    global game_active, start_time, score, attempts
    game_active = True
    start_time = pygame.time.get_ticks()
    score = 0
    attempts = 0
    reset_ball()

def format_time(milliseconds):
    seconds = max(0, milliseconds // 1000)
    return f"{seconds // 60:02d}:{seconds % 60:02d}"

running = True
show_menu = True

while running:
    screen.fill(BLUE)
    
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        
        if event.type == pygame.KEYDOWN:
            if show_menu:
                if event.key == pygame.K_1:
                    set_level(1)
                    show_menu = False
                    start_game()
                elif event.key == pygame.K_2:
                    set_level(2)
                    show_menu = False
                    start_game()
                elif event.key == pygame.K_3:
                    set_level(3)
                    show_menu = False
                    start_game()
                elif event.key == pygame.K_UP and game_time < 120:
                    game_time += 10
                elif event.key == pygame.K_DOWN and game_time > 10:
                    game_time -= 10
            elif game_active:
                if event.key == pygame.K_SPACE and not shooting:
                    shooting = True
                    attempts += 1
                    # Calculate velocity based on power and angle
                    angle_rad = math.radians(angle)
                    ball_velocity[0] = power * math.cos(angle_rad) * 0.2
                    ball_velocity[1] = -power * math.sin(angle_rad) * 0.2
                
                if event.key == pygame.K_r:
                    reset_ball()
                
                if event.key == pygame.K_ESCAPE:
                    show_menu = True
                    game_active = False
            else:
                if event.key == pygame.K_RETURN:
                    show_menu = True
    
    if show_menu:
        # Draw menu
        title = font.render("BASKETBALL SHOOTING GAME", True, BLACK)
        screen.blit(title, (WIDTH//2 - title.get_width()//2, 100))
        
        level_text = font.render(f"Select Level (1-3) or adjust time (UP/DOWN): {game_time} seconds", True, BLACK)
        screen.blit(level_text, (WIDTH//2 - level_text.get_width()//2, 200))
        
        for i in range(1, 4):
            level_desc = font.render(f"Level {i}: {['Easy', 'Medium', 'Hard'][i-1]}", True, BLACK)
            screen.blit(level_desc, (WIDTH//2 - level_desc.get_width()//2, 250 + i * 40))
    
    elif game_active:
        # Calculate remaining time
        elapsed = (pygame.time.get_ticks() - start_time) // 1000
        remaining = max(0, game_time - elapsed)
        
        # Check if time is up
        if remaining <= 0 and game_active:
            game_active = False
            if buzzer_sound:
                buzzer_sound.play()
        
        # Power and angle control when not shooting
        if not shooting:
            keys = pygame.key.get_pressed()
            if keys[pygame.K_UP] and power < 100:
                power += 1
            if keys[pygame.K_DOWN] and power > 0:
                power -= 1
            if keys[pygame.K_LEFT] and angle < 90:
                angle += 1
            if keys[pygame.K_RIGHT] and angle > 0:
                angle -= 1
        
        # Ball physics when shooting
        if shooting:
            # Apply wind effect based on level
            wind_effect = level_settings[level]["wind"] * (random.random() - 0.5)
            ball_velocity[0] += wind_effect
            
            ball_pos[0] += ball_velocity[0]
            ball_pos[1] += ball_velocity[1]
            ball_velocity[1] += gravity
            
            # Check if ball scored
            check_score()
            
            # Check for bounce on floor
            if ball_pos[1] + ball_radius > HEIGHT:
                ball_pos[1] = HEIGHT - ball_radius
                ball_velocity[1] = -ball_velocity[1] * 0.7  # Bounce with energy loss
                if bounce_sound and abs(ball_velocity[1]) > 2:
                    bounce_sound.play()
            
            # Check for bounce on walls
            if ball_pos[0] - ball_radius < 0:
                ball_pos[0] = ball_radius
                ball_velocity[0] = -ball_velocity[0] * 0.7
                if bounce_sound and abs(ball_velocity[0]) > 2:
                    bounce_sound.play()
            elif ball_pos[0] + ball_radius > WIDTH:
                ball_pos[0] = WIDTH - ball_radius
                ball_velocity[0] = -ball_velocity[0] * 0.7
                if bounce_sound and abs(ball_velocity[0]) > 2:
                    bounce_sound.play()
            
            # Reset if ball stops moving
            if abs(ball_velocity[0]) < 0.1 and abs(ball_velocity[1]) < 0.1 and ball_pos[1] > HEIGHT - ball_radius - 10:
                reset_ball()
        
        # Draw the basketball (orange)
        pygame.draw.circle(screen, ORANGE, (int(ball_pos[0]), int(ball_pos[1])), ball_radius)
        
        # Draw the hoop (red)
        pygame.draw.rect(screen, RED, (hoop_pos[0], hoop_pos[1], hoop_width, hoop_height))
        
        # Draw the backboard
        pygame.draw.rect(screen, WHITE, (hoop_pos[0] + hoop_width, hoop_pos[1] - 50, 10, 100))
        
        # Draw the net (white)
        for i in range(0, len(net_points), 2):
            if i + 1 < len(net_points):
                pygame.draw.line(screen, WHITE, net_points[i], net_points[i+1], 2)
        
        # Connect vertical net lines
        for i in range(0, len(net_points), 2):
            if i + 2 < len(net_points):
                pygame.draw.line(screen, WHITE, net_points[i], net_points[i+2], 2)
                pygame.draw.line(screen, WHITE, net_points[i+1], net_points[i+3], 2)
        
        # Draw power meter
        draw_power_meter()
        
        # Draw angle indicator
        angle_x = ball_pos[0] + 50 * math.cos(math.radians(angle))
        angle_y = ball_pos[1] - 50 * math.sin(math.radians(angle))
        pygame.draw.line(screen, BLACK, ball_pos, (angle_x, angle_y), 2)
        
        # Draw score and attempts
        score_text = font.render(f"Score: {score}/{attempts}", True, BLACK)
        screen.blit(score_text, (10, 10))
        
        # Draw time remaining
        time_text = font.render(f"Time: {format_time(remaining * 1000)}", True, BLACK)
        screen.blit(time_text, (10, 50))
        
        # Draw level indicator
        level_text = font.render(f"Level: {level}", True, GREEN)
        screen.blit(level_text, (10, 90))
        
        # Draw instructions
        instructions = [
            "SPACE: Shoot ball",
            "UP/DOWN: Adjust power",
            "LEFT/RIGHT: Adjust angle",
            "R: Reset ball",
            "ESC: Menu"
        ]
        
        for i, instruction in enumerate(instructions):
            text = font.render(instruction, True, BLACK)
            screen.blit(text, (WIDTH - 250, 10 + i * 30))
    
    else:
        # Game over screen
        game_over = font.render("GAME OVER", True, RED)
        screen.blit(game_over, (WIDTH//2 - game_over.get_width()//2, 200))
        
        final_score = font.render(f"Final Score: {score}/{attempts}", True, BLACK)
        screen.blit(final_score, (WIDTH//2 - final_score.get_width()//2, 250))
        
        restart = font.render("Press ENTER to return to menu", True, BLACK)
        screen.blit(restart, (WIDTH//2 - restart.get_width()//2, 300))
    
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()
