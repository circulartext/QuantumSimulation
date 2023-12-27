import pygame
import sys
import random

# Initialize Pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
FPS = 60

# Colors
WHITE = (255, 255, 255)
RED = (255, 0, 0)

# Initialize screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Imaginary Quantum Superposition Simulation")

# Initialize four classical bits
bits = [0, 0, 0, 0]

# Initialize score
score = 0

# Main game loop
clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Simulate superposition with classical probabilities
    probabilities = [0.5, 0.5, 0.5, 0.5]

    # Save current state for comparison
    previous_state = tuple(bits)

    # Randomly choose states based on probabilities
    bits = [0 if random.random() < prob else 1 for prob in probabilities]

    # Compare current state with previous state and update score
    if tuple(bits) == previous_state:
        score += 1

    # Draw background
    screen.fill(WHITE)

    # Draw bits, probabilities, and score
    font = pygame.font.Font(None, 36)
    bit_texts = [font.render(f"Bit {i + 1}: {bits[i]} (P={prob:.2f})", True, RED) for i, prob in enumerate(probabilities)]
    for i, text in enumerate(bit_texts):
        screen.blit(text, (WIDTH // 4, (i + 1) * HEIGHT // 5))

    # Draw score
    score_text = font.render(f"Score: {score}", True, RED)
    screen.blit(score_text, (WIDTH // 2, HEIGHT - 50))

    # Update the display
    pygame.display.flip()

    # Cap the frame rate
    clock.tick(FPS)
