# Quantum Simulator with Express.js, Socket.io, and HTML Interface

This project implements a Quantum Simulator using Express.js and Socket.io on the server-side, combined with an interactive HTML interface on the client-side. The simulation allows users to explore the behavior of qubits, employing classical probabilities to simulate quantum concepts like superposition and measurement.

## Server-Side (Express.js)

### Server Configuration
The `index.js` file sets up an Express.js server with Socket.io integration.

### Qubit Simulation Logic
The server-side logic includes functions for updating qubit states based on classical probabilities and predefined controller settings.

### Real-Time Communication
Utilizes Socket.io to facilitate real-time bidirectional communication between the server and connected clients.

## Client-Side (HTML Interface)

### User Interface
The HTML interface provides a simple yet effective control panel for users to interact with the quantum simulator.

### Input Controls
Users can input the number of qubits and adjust the controller setting, providing flexibility in customizing the simulation.

### Simulation Trigger
The "Simulate" button triggers a request to the server to update qubit states based on the user-defined parameters.

### Real-Time Display
The interface dynamically displays the updated qubit states, highlighting matching pairs and providing a visual representation of the quantum simulation.

## HTML Structure

### Head Section
Contains metadata, including the title and styles for qubit visualization.

### Body Section
The body includes input fields for adjusting the number of qubits and the controller setting, a simulation trigger button, and areas to display qubit states and the current score.

### Script Section
Incorporates client-side JavaScript for handling user interactions, emitting events to the server, and updating the HTML dynamically.

## Dependencies

### Socket.io CDN
Utilizes the Socket.io CDN to enable real-time communication between the server and clients.

## Getting Started

### Install Dependencies:
```bash
npm install

Run the Application:
npm start

Open the Interface:
Open your browser and navigate to http://localhost:3000 to explore the quantum simulator.

Interact with Controls:
Adjust the number of qubits and the controller setting, then click the "Simulate" button to observe real-time updates.

Feel free to experiment with different settings and explore the fascinating world of quantum simulation!
