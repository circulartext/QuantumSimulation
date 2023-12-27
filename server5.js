const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Number of qubits
let num_qubits = 20; // You can change this number

// Initialize classical bits
let bits = Array.from({ length: num_qubits }, () => 0);

// Initialize score
let score = 0;

// Controller setting
let controllerSetting = 0;

// Function to count matches in a group
function countMatchesInGroup(...qubitIndices) {
    return qubitIndices.reduce((count, idx) => (bits[idx] === 1 ? count + 1 : count), 0);
}

function updateBits() {
    // Simulate superposition with classical probabilities for each qubit
    const probabilities = Array.from({ length: num_qubits }, () => 0.5);

    // Save current states for comparison
    const previousStates = [...bits];

    // Randomly choose states based on probabilities
    bits = probabilities.map(prob => (Math.random() < prob ? 0 : 1));

    // Calculate the group size based on the controller setting
    const groupSize = Math.floor(num_qubits / 4);

    // Compare current states with previous states and update score
    for (let i = 0; i < num_qubits - groupSize + 1; i += groupSize) {
        const matchesInGroup = countMatchesInGroup(...Array.from({ length: groupSize }, (_, j) => i + j));

        // Check the matching condition for the specific controller setting
        if (controllerSetting === 0 && matchesInGroup > 0) {
            score += 1;
        } else if (controllerSetting > 0 && matchesInGroup === groupSize) {
            score += 1;
        }
    }

    // Calculate the percentage of matches for each group
    // Calculate the percentage of matches for each group
    const percentA = ((countMatchesInGroup(...Array.from({ length: num_qubits / 4 }, (_, j) => j)) / (num_qubits / 4)) * 100).toFixed(2);
    const percentB = ((countMatchesInGroup(...Array.from({ length: num_qubits / 4 }, (_, j) => j + num_qubits / 4)) / (num_qubits / 4)) * 100).toFixed(2);
    const percentC = ((countMatchesInGroup(...Array.from({ length: num_qubits / 4 }, (_, j) => j + 2 * num_qubits / 4)) / (num_qubits / 4)) * 100).toFixed(2);
    const percentD = ((countMatchesInGroup(...Array.from({ length: num_qubits / 4 }, (_, j) => j + 3 * num_qubits / 4)) / (num_qubits / 4)) * 100).toFixed(2);
    // Output the letter along with the score
    console.log(`Score: ${score}, Output: A${percentA}%, B${percentB}%, C${percentC}%, D${percentD}%`);

    return bits;
}

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // Send initial parameters to the client
    socket.emit('initialParams', { num_qubits, controllerSetting });

    // Listen for controller setting changes from the client
    socket.on('changeControllerSetting', (newSetting) => {
        controllerSetting = newSetting;
        io.emit('controllerSettingChanged', controllerSetting);
    });

    // Listen for number of qubits changes from the client
    socket.on('changeNumQubits', (newNumQubits) => {
        num_qubits = newNumQubits;
        io.emit('numQubitsChanged', num_qubits);
    });

    // Listen for simulation updates from the client
    socket.on('requestSimulationUpdate', () => {
        const updatedBits = updateBits();
        io.emit('simulationUpdated', { bits: updatedBits, score });
    });
});

// Start the server
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
