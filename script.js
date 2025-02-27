document.addEventListener('DOMContentLoaded', () => {
    const tapeElement = document.getElementById('tape');
    const currentStateElement = document.getElementById('current-state');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const resetButton = document.getElementById('reset');
    const tapeInput = document.getElementById('tape-input');
    const setTapeButton = document.getElementById('set-tape');
    const rulesContainer = document.getElementById('rules-container');
    const addRuleButton = document.getElementById('add-rule');
    const setRulesButton = document.getElementById('set-rules');

    let tape = ['B', '1', '1', '0', 'B']; // Cinta inicial
    let headPosition = 1; // Posición inicial de la cabeza
    let currentState = 'q0'; // Estado inicial
    let rules = {}; // Reglas de transición

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

    function updateState(newState) {
        currentState = newState;
        currentStateElement.textContent = currentState;
    }

    function parseRules() {
        const newRules = {};
        rulesContainer.querySelectorAll('.rule').forEach(rule => {
            const inputs = rule.querySelectorAll('input');
            const currentState = inputs[0].value;
            const readSymbol = inputs[1].value;
            const newState = inputs[2].value;
            const writeSymbol = inputs[3].value;
            const move = inputs[4].value;
            if (currentState && readSymbol && newState && writeSymbol && move) {
                if (!newRules[currentState]) newRules[currentState] = {};
                newRules[currentState][readSymbol] = { newState, writeSymbol, move };
            }
        });
        return newRules;
    }

    function step() {
        const currentSymbol = tape[headPosition];
        if (rules[currentState] && rules[currentState][currentSymbol]) {
            const { newState, writeSymbol, move } = rules[currentState][currentSymbol];
            tape[headPosition] = writeSymbol;
            headPosition += move === 'R' ? 1 : -1;
            updateState(newState);
        } else {
            alert('Máquina detenida: No hay regla definida');
        }
        renderTape();
    }

    function reset() {
        tape = ['B', '1', '1', '0', 'B'];
        headPosition = 1;
        updateState('q0');
        renderTape();
    }

    setTapeButton.addEventListener('click', () => {
        const input = tapeInput.value.trim();
        if (input) {
            tape = ['B', ...input.split(''), 'B'];
            headPosition = 1;
            renderTape();
        }
    });

    addRuleButton.addEventListener('click', () => {
        const ruleDiv = document.createElement('div');
        ruleDiv.classList.add('rule');
        ruleDiv.innerHTML = `
            (<input type="text" class="state-input" placeholder="q0">, 
            <input type="text" class="symbol-input" placeholder="0">) -> 
            (<input type="text" class="state-input" placeholder="q1">, 
            <input type="text" class="symbol-input" placeholder="1">, 
            <input type="text" class="move-input" placeholder="R">)
            <button class="delete-rule">Eliminar</button>
        `;
        rulesContainer.appendChild(ruleDiv);

        // Agregar evento para eliminar la regla
        ruleDiv.querySelector('.delete-rule').addEventListener('click', () => {
            ruleDiv.remove();
        });
    });

    setRulesButton.addEventListener('click', () => {
        rules = parseRules();
        alert('Reglas establecidas');
    });

    prevButton.addEventListener('click', () => {
        if (headPosition > 0) {
            headPosition--;
            renderTape();
        }
    });

    nextButton.addEventListener('click', step);

    resetButton.addEventListener('click', reset);

    renderTape();
});