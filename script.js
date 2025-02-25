document.addEventListener('DOMContentLoaded', () => {
    const tapeElement = document.getElementById('tape');
    const currentStateElement = document.getElementById('current-state');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const resetButton = document.getElementById('reset');
    const tapeInput = document.getElementById('tape-input');
    const setTapeButton = document.getElementById('set-tape');
    const saveConfigButton = document.getElementById('save-config');
    const loadConfigButton = document.getElementById('load-config');

    let tape = ['B', '1', '0', '1', 'B']; // Cinta inicial
    let headPosition = 1; // Posición inicial de la cabeza
    let currentState = 'q0'; // Estado inicial

    // Función para renderizar la cinta
    function renderTape() {
        tapeElement.innerHTML = '';
        tape.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (index === headPosition) {
                cellElement.classList.add('active');
            }
            cellElement.textContent = cell;
            tapeElement.appendChild(cellElement);
        });
    }

    // Función para actualizar el estado
    function updateState(newState) {
        currentState = newState;
        currentStateElement.textContent = currentState;
    }

    // Función para avanzar un paso
    function step() {
        const currentSymbol = tape[headPosition];
        // Definir las transiciones de la Máquina de Turing
        if (currentState === 'q0' && currentSymbol === '1') {
            tape[headPosition] = '0';
            headPosition++;
            updateState('q1');
        } else if (currentState === 'q1' && currentSymbol === '0') {
            tape[headPosition] = '1';
            headPosition--;
            updateState('q0');
        } else {
            alert('Máquina detenida');
        }
        renderTape();
    }

    // Función para reiniciar la máquina
    function reset() {
        tape = ['B', '1', '0', '1', 'B'];
        headPosition = 1;
        updateState('q0');
        renderTape();
    }

    // Establecer la cinta inicial
    setTapeButton.addEventListener('click', () => {
        const input = tapeInput.value.trim();
        if (input) {
            tape = ['B', ...input.split(''), 'B'];
            headPosition = 1;
            renderTape();
        }
    });

    // Guardar configuración
    saveConfigButton.addEventListener('click', () => {
        const config = {
            tape,
            headPosition,
            currentState,
        };
        localStorage.setItem('turingConfig', JSON.stringify(config));
        alert('Configuración guardada');
    });

    // Cargar configuración
    loadConfigButton.addEventListener('click', () => {
        const config = JSON.parse(localStorage.getItem('turingConfig'));
        if (config) {
            tape = config.tape;
            headPosition = config.headPosition;
            currentState = config.currentState;
            updateState(currentState);
            renderTape();
            alert('Configuración cargada');
        } else {
            alert('No hay configuración guardada');
        }
    });

    // Eventos de los botones
    prevButton.addEventListener('click', () => {
        if (headPosition > 0) {
            headPosition--;
            renderTape();
        }
    });

    nextButton.addEventListener('click', step);

    resetButton.addEventListener('click', reset);

    // Renderizar la cinta inicial
    renderTape();
});