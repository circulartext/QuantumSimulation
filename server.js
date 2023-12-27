const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Number of qubits
let num_qubits = 10;

// Initialize classical bits
let bits = Array.from({ length: num_qubits }, () => 0);

// Initialize score
let score = 0;

// Controller setting
let controllerSetting = 0;

function updateBits() {
  // Simulate superposition with classical probabilities for each qubit
  const probabilities = Array.from({ length: num_qubits }, () => 0.5);

  // Save current states for comparison
  const previousStates = [...bits];

  // Randomly choose states based on probabilities
  bits = probabilities.map(prob => (Math.random() < prob ? 0 : 1));

  // Calculate the group size based on the controller setting
  const groupSize = 2 + (controllerSetting * 2);

  // Compare current states with previous states and update score
  for (let i = 0; i < num_qubits - groupSize + 1; i += groupSize) {
    let match = true;

    for (let j = 0; j < groupSize - 1; j++) {
      const currentBit = bits[i + j];
      const nextBit = bits[i + j + 1];
      const previousBit = previousStates[i + j];
      const previousNextBit = previousStates[i + j + 1];

      // Check the matching condition for the specific controller setting
      if (controllerSetting === 0 && (currentBit !== previousBit || nextBit !== previousNextBit)) {
        match = false;
        break;
      } else if (controllerSetting > 0 && currentBit !== previousBit) {
        match = false;
        break;
      }
    }

    if (match) {
      score += 1;
    }
  }

  // Calculate the number of matches in the first and second halves
  const matchesInA = Math.floor(score / 2);
  const matchesInB = score - matchesInA;

  // Determine the output letter based on the distribution of matches
  const outputLetter = matchesInA % 2 === 0 ? 'A' : 'B';

  // Calculate the percentages of matches in groups A and B
  const percentInA = (matchesInA / (num_qubits / 2)) * 100;
  const percentInB = (matchesInB / (num_qubits / 2)) * 100;

  // Output the letter, score, and percentages
  console.log(`Score: ${score}, Output: ${outputLetter}, A: ${percentInA.toFixed(2)}%, B: ${percentInB.toFixed(2)}%`);

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