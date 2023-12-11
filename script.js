// Setup animations and event listeners when the page loads
document.addEventListener("DOMContentLoaded", function() {
    initializeBalls(8, 'classicalBallsContainer'); // Initialize classical balls
    initializeBalls(8, 'quantumBallsContainer'); // Initialize quantum balls
    animateClassicalSearch('classicalBallsContainer');
    animateQuantumSearch('quantumBallsContainer');
    
    // Add event listeners for the superposition controls
    document.getElementById("qubitAngle").addEventListener("input", function(event) {
        // Update the angle display
        let angle = event.target.value;
        document.getElementById("angleDisplay").textContent = angle + "°";
        // Update the visualization of the qubit state
        // ...
    });

    document.getElementById("qubitAmplitude").addEventListener("input", function(event) {
        // Update the amplitude display
        let amplitude = event.target.value;
        document.getElementById("amplitudeDisplay").textContent = amplitude;
        // Update the visualization of the qubit state
        // ...
    });
    document.getElementById('runButton').addEventListener('click', runGroverAlgorithm);
});

// Function to update the superposition state
function updateSuperposition(event) {
    const amplitude = event.target.value;
    // Update the visual representation of the superposition here, if needed
    console.log(`Qubit superposition amplitude: ${amplitude}`);
}

function animateClassicalSearch(containerId) {
    const balls = document.getElementById(containerId).children;
    let currentIndex = 0;
    let pauseAnimation = false; // Flag to pause iteration

    const interval = setInterval(() => {
        if (pauseAnimation) {
            // Skip iteration if animation is paused
            return;
        }

        // Reset all balls
        for (let ball of balls) {
            ball.classList.remove('ball-flashing-grey', 'ball-flashing-red', 'ball-found');
        }

        // If we're at the 6th ball, flash it red twice
        if (currentIndex === 5) {
            balls[currentIndex].classList.add('ball-found');
            pauseAnimation = true; // Pause further iteration

            // After 2 seconds (time for two flashes), resume iteration
            setTimeout(() => {
                pauseAnimation = false;
            }, 1500);
        } else {
            // Otherwise, flash the current ball grey
            balls[currentIndex].classList.add('ball-flashing-grey');
        }

        // Increment and loop back to the first ball if needed
        currentIndex = (currentIndex + 1) % balls.length;

    }, 1000); // The speed of the animation
}



function animateQuantumSearch(containerId) {
    const balls = document.getElementById(containerId).children;

    setInterval(() => {
        // Make all balls flash grey
        for (let ball of balls) {
            ball.classList.remove('ball-found', 'ball-flashing-red');
            ball.classList.add('ball-flashing-grey');
        }

        // Make the 6th ball flash red
        balls[5].classList.remove('ball-flashing-grey');
        balls[5].classList.add('ball-flashing-red');
    }, 1000); // Adjust timing as necessary
}



function runGroverAlgorithm() {
    const numQubits = parseInt(document.getElementById('qubitsSelection').value);
    const amplitude = parseFloat(document.getElementById('qubitAmplitude').value); // Get the superposition amplitude
    const angle = parseFloat(document.getElementById('qubitAngle').value); // Get the qubit angle
    
    // Simulate the algorithms and get the results
    const quantumResult = simulateGroverAlgorithmWithSuperposition(numQubits, amplitude, angle);
    const classicalResult = simulateClassicalSearch(numQubits);
    
    // Display the results
    displayResult('classicalResult', classicalResult);
    displayResult('quantumResult', quantumResult);
}


function simulateGroverAlgorithmWithSuperposition(numQubits, amplitude, angle) {
    const databaseSize = Math.pow(2, numQubits);

    // Optimal angle and amplitude for Grover's Algorithm
    const optimalAngle = 90; // 90 degrees or pi/2 radians is optimal for equal superposition
    const optimalAmplitude = 0.5; // 0.5 represents equal probability of |0⟩ and |1⟩ states

    // Calculate deviations from optimal values
    const angleDeviation = Math.abs(angle - optimalAngle);
    const amplitudeDeviation = Math.abs(amplitude - optimalAmplitude);

    // The factors represent how far from optimal we are, 
    // with 0 being optimal and 1 being the furthest from optimal
    const angleFactor = (angleDeviation === 0) ? 0 : angleDeviation / optimalAngle;
    const amplitudeFactor = (amplitudeDeviation === 0) ? 0 : amplitudeDeviation / optimalAmplitude;

    // Combine the two factors, with 0 being the best case and 1 being the worst
    const combinedFactor = Math.max(angleFactor, amplitudeFactor);

    // If both the angle and amplitude are optimal, iterations are 1.
    // Otherwise, increase iterations based on how far from optimal we are.
    const iterations = (combinedFactor === 0) ? 1 : Math.ceil(Math.sqrt(databaseSize) * combinedFactor);

    // For simplicity, let's say the target is always at the middle of the database.
    const foundItem = Math.floor(databaseSize / 2);

    return { iterations, foundItem };
}




// Simulation of a classical search for 1 qubit
function simulateClassicalSearch(numQubits) {
    // For 1 qubit, the classical search will find the item in 1 or 2 steps
    const databaseSize = Math.pow(2, numQubits);
    // const foundItem = Math.floor(Math.random() * databaseSize); // Random target
    const foundItem = Math.floor(databaseSize / 2);
    // Classical search checks each item one by one, so iterations equals the position + 1
    const iterations = foundItem + 1;
    
    return { iterations, foundItem };
}




// Function to display individual result
function displayResult(elementId, result) {
    let resultElement = document.getElementById(elementId);
    // Make sure the element was found before trying to update it
    if (resultElement) {
        resultElement.textContent = `Iterations: ${result.iterations}, Found Item: ${result.foundItem}`;
        // If you had set visibility to hidden, reset it to visible
        resultElement.style.visibility = 'visible';
    } else {
        // If the element wasn't found, log an error for debugging
        console.error('Result element not found:', elementId);
    }
}

// Function to initialize the balls
function initializeBalls(numBalls, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing balls
    for (let i = 0; i < numBalls; i++) {
        let ball = document.createElement('div');
        ball.classList.add('ball');
        container.appendChild(ball);
    }
}

// Function to display individual result
function displayResult(elementId, result) {
    let resultElement = document.getElementById(elementId);
    resultElement.textContent = `Iterations: ${result.iterations}, Found Item: ${result.foundItem}`;
}

