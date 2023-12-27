<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Simulation Control</title>
    <style>
        .qubit {
            display: inline-block;
            margin: 3px;
            padding: 3px;
            border: 1px solid #000;
        }

        .matching {
            background-color: #8eff8e; /* Light green background for matching pairs */
        }

        .pair-1 {
            background-color: lightblue; /* Color for the first pair */
        }

        .pair-2 {
            background-color: lightcoral; /* Color for the second pair */
        }
        /* Add more styles for additional pairs as needed */
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.js"></script>
</head>
<body>
    <h1>Quantum Simulation Control</h1>

    <label for="numQubits">Number of Qubits:</label>
    <input type="number" id="numQubits" value="10" min="1" max="1000000">

    <label for="controllerSetting">Controller Setting:</label>
    <input type="number" id="controllerSetting" value="0" min="0" max="10">

    <button id="simulateButton">Simulate</button>

    <div id="qubitStates"></div>
    <div id="score"></div>

    <script>
        const socket = io();

        // Listen for initial parameters from the server
        socket.on('initialParams', ({ num_qubits, controllerSetting }) => {
            document.getElementById('numQubits').value = num_qubits;
            document.getElementById('controllerSetting').value = controllerSetting;
        });

        // Listen for changes in the number of qubits
        document.getElementById('numQubits').addEventListener('input', () => {
            const newNumQubits = parseInt(document.getElementById('numQubits').value);
            socket.emit('changeNumQubits', newNumQubits);
        });

        // Listen for changes in the controller setting
        document.getElementById('controllerSetting').addEventListener('input', () => {
            const newSetting = parseInt(document.getElementById('controllerSetting').value);
            socket.emit('changeControllerSetting', newSetting);
        });

        // Listen for simulation updates from the server
        socket.on('simulationUpdated', ({ bits, score }) => {
            const qubitStatesDiv = document.getElementById('qubitStates');
            const scoreDiv = document.getElementById('score');

            // Clear previous content
            qubitStatesDiv.innerHTML = '';
            scoreDiv.innerHTML = `Score: ${score}`;

            // Display qubit states
            bits.forEach((bit, index) => {
                const qubitDiv = document.createElement('div');
                qubitDiv.classList.add('qubit');
                qubitDiv.textContent = `Q${index + 1}: ${bit}`;

                // Highlight matching pairs
                if (index < bits.length - 1 && bit === bits[index + 1]) {
                    qubitDiv.classList.add('matching');
                    // Assign a unique pair class to each pair
                    const pairClass = `pair-${Math.floor(index / 2) + 1}`;
                    qubitDiv.classList.add(pairClass);
                }

                qubitStatesDiv.appendChild(qubitDiv);
            });
        });

        // Simulate button click event
        document.getElementById('simulateButton').addEventListener('click', () => {
            socket.emit('requestSimulationUpdate');
        });
    </script>
</body>
</html>
