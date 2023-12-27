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

# Number of qubits
num_qubits = 10

# Initialize classical bits
bits = [0] * num_qubits

# Initialize score
score = 0

# Main game loop
clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Simulate superposition with classical probabilities for each qubit
    probabilities = [0.5] * num_qubits

    # Save current states for comparison
    previous_states = list(bits)

    # Randomly choose states based on probabilities
    bits = [0 if random.random() < prob else 1 for prob in probabilities]

    # Compare current states with previous states and update score
    for current_state, previous_state in zip(bits[:-1], previous_states[:-1]):
        if current_state == previous_state:
            score += 1

    # Draw background
    screen.fill(WHITE)

    # Draw qubits and probabilities
    font = pygame.font.Font(None, 24)
    for i, (bit, prob) in enumerate(zip(bits, probabilities)):
        bit_text = font.render(f"Qubit {i + 1}: {bit} (P={prob:.2f})", True, RED)
        screen.blit(bit_text, (WIDTH // 4, i * HEIGHT // (num_qubits + 1)))

    # Draw score
    score_text = font.render(f"Score: {score}", True, RED)
    screen.blit(score_text, (WIDTH // 2, HEIGHT - 50))

    # Update the display
    pygame.display.flip()

    # Cap the frame rate
    clock.tick(FPS)
