        let display = document.getElementById('display');
        let currentInput = '0';
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
            display.classList.add('active');
            setTimeout(() => display.classList.remove('active'), 100);
        }

        function clearDisplay() {
            currentInput = '0';
            shouldResetDisplay = false;
            updateDisplay();
        }

        function appendToDisplay(value) {
            if (shouldResetDisplay && !isOperator(value)) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            
            if (currentInput === '0' && value !== '.') {
                currentInput = '';
            }
            
            // Prevent multiple operators or decimals
            if (isOperator(value) && isOperator(currentInput[currentInput.length - 1])) {
                currentInput = currentInput.slice(0, -1);
            }
            
            if (value === '.' && currentInput.includes('.')) {
                let parts = currentInput.split(/[\+\-\*\/]/);
                if (parts[parts.length - 1].includes('.')) {
                    return;
                }
            }
            
            currentInput += value;
            updateDisplay();
        }

        function isOperator(char) {
            return ['+', '-', '*', '/'].includes(char);
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function calculate() {
            try {
                // Remove trailing operators
                let expression = currentInput;
                while (isOperator(expression[expression.length - 1])) {
                    expression = expression.slice(0, -1);
                }
                
                let result = eval(expression);
                
                // Handle division by zero
                if (!isFinite(result)) {
                    currentInput = 'Error';
                } else {
                    // Round to avoid floating point issues
                    result = Math.round(result * 100000000) / 100000000;
                    currentInput = result.toString();
                }
                
                shouldResetDisplay = true;
            } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                appendToDisplay(e.key);
            } else if (e.key === '.') {
                appendToDisplay('.');
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                appendToDisplay(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                calculate();
            } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                clearDisplay();
            } else if (e.key === 'Backspace') {
                deleteLast();
            }
        });