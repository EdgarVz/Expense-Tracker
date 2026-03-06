const { writeFile } = require('node:fs');
const path = require('node:path');
const fs = require('fs').promises;

/**
 * Validates the expenses file before operations
 * Valida el archivo de gastos antes de las operaciones
 */
async function validateExpensesFile() {
    try {
        const stats = await fs.stat('expenses.json');
        
        // Check if file is empty / Verificar si el archivo está vacío
        if (stats.size === 0) {
            console.log("⚠️  Tasks file is empty. Reinitializing...");
            await fs.writeFile('expenses.json', '[]', 'utf8');
            return false;
        }
        
        // Check read/write permissions / Verificar permisos de lectura/escritura
        try {
            await fs.access('expenses.json', fs.constants.R_OK | fs.constants.W_OK);
        } catch {
            console.error("❌ Insufficient permissions for expenses.json");
            console.error("💡 Try: chmod 666 tasks.json (Linux/Mac)");
            return false;
        }
        
        return true;
    } catch (error) {
        // File doesn't exist - will be created in ReadExpenses() / Archivo no existe - se creará en ReadExpenses()
        if (error.code === 'ENOENT') {
            return true;
        }
        console.error("❌ Error validating expenses file:", error.message);
        return false;
    }
}

/**
 * Parses command line flags and returns an object with values
 * Parsea las flags de línea de comandos y devuelve un objeto con los valores
 * @param {string[]} args - Command line arguments / Argumentos de línea de comandos
 * @returns {Object} Flags object / Objeto con las flags
 */
function parseFlags(args) {
    // Initialize flags with default values / Inicializar flags con valores por defecto
    const flags = {
        id: null,
        description: null,
        category: null,
        amount: null,
        month: null
    };
    
    // Start from index 1 to skip the command / Empezar desde índice 1 para omitir el comando
    for (let i = 1; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            // Handle --flag=value format / Manejar formato --flag=valor
            if (args[i].includes('=')) {
                const [flag, value] = args[i].slice(2).split('=');
                if (!value) throw new Error(`flag --${flag} requires a value`);
                
                // Specific validation for each flag type / Validación específica para cada tipo de flag
                if (flag === 'amount') {
                    const amount = parseFloat(value);
                    if (isNaN(amount) || amount < 0) {
                        throw new Error(`Amount must be a positive number`);
                    }
                    flags[flag] = amount;
                } else if (flag === 'id') {
                    const id = parseFloat(value);
                    if (isNaN(id) || id < 0) {
                        throw new Error(`ID must be a number`);
                    }
                    flags[flag] = id;
                } else if (flag === 'month') {
                    const month = parseFloat(value);
                    if (isNaN(month) || month < 1 || month > 12) {
                        throw new Error(`Month must be a number between 1 and 12`);
                    }
                    if (!Number.isInteger(month)) {
                        throw new Error(`Month must be an integer (no decimals)`);
                    }
                    flags[flag] = month;
                } else {
                    // Generic flags (description, category) / Flags genéricas
                    flags[flag] = value;
                }
            }
            // Handle --flag value format / Manejar formato --flag valor
            else {
                const flag = args[i].slice(2);
                const value = args[i + 1];

                // Validate that value exists and is not another flag / Validar que el valor existe y no es otra flag
                if (!value || value.startsWith('--')) {
                    throw new Error(`flag --${flag} requires a value`);
                }

                // Specific validation for each flag type / Validación específica para cada tipo de flag
                if (flag === 'amount') {
                    const amount = parseFloat(value);
                    if (isNaN(amount) || amount < 0) {
                        throw new Error(`Amount must be a positive number`);
                    }
                    flags[flag] = amount;
                } else if (flag === 'id') {
                    const id = parseFloat(value);
                    if (isNaN(id) || id < 0) {
                        throw new Error(`ID must be a number`);
                    }
                    flags[flag] = id;
                } else if (flag === 'month') {
                    const month = parseFloat(value);
                    if (isNaN(month) || month < 1 || month > 12) {
                        throw new Error(`Month must be a number between 1 and 12`);
                    }
                    if (!Number.isInteger(month)) {
                        throw new Error(`Month must be an integer (no decimals)`);
                    }
                    flags[flag] = month;
                } else {
                    // Generic flags (description, category) / Flags genéricas
                    flags[flag] = value;
                }
                i++; // Skip next argument since it's a value / Saltar el siguiente argumento porque es un valor
            }
        }
    }
    return flags;
}

/**
 * Reads expenses from JSON file or creates it if it doesn't exist
 * Lee gastos del archivo JSON o lo crea si no existe
 * @returns {Array} Array of expenses / Array de gastos
 */
async function ReadExpenses() {
    try {
        await fs.access('expenses.json');
        const Expenses = await fs.readFile('expenses.json', 'utf8');
        
        try {
            const ArrayExpenses = JSON.parse(Expenses);
            
            // Validate it's an array / Validar que sea un array
            if (!Array.isArray(ArrayExpenses)) {
                console.error("❌ Data is not an array. Reinitializing...");
                return [];
            }

            return ArrayExpenses;
            
        } catch (parseError) {
            // Handle corrupted JSON / Manejar JSON corrupto
            console.error("❌ Corrupted JSON file. Creating backup and starting fresh...");
            const backupPath = `expenses.backup.${Date.now()}.json`;
            await fs.writeFile(backupPath, Expenses);
            console.log(`✅ Backup created: ${backupPath}`);
            return [];
        }
    } catch (error) {
        // File doesn't exist - create new / Archivo no existe - crear nuevo
        if (error.code === 'ENOENT') {
            await fs.writeFile('expenses.json', '[]', 'utf8');
            return [];
        }
        throw error; // Re-throw unexpected errors / Relanzar errores inesperados
    }
}

/**
 * Writes expenses to JSON file
 * Escribe gastos en el archivo JSON
 * @param {Array} ArrayExpenses - Array of expenses to save / Array de gastos a guardar
 * @returns {boolean} Success status / Estado de éxito
 */
async function WriteExpenses(ArrayExpenses) {
    try {
        if (!Array.isArray(ArrayExpenses)) {
            throw new Error("Data must be an array");
        }
        const jsonData = JSON.stringify(ArrayExpenses, null, 2);
        await fs.writeFile('expenses.json', jsonData, 'utf-8');
        return true;
    } catch (error) {
        // Handle specific file system errors / Manejar errores específicos del sistema de archivos
        if (error.code === 'EACCES') {
            console.error("❌ Permission denied: Cannot write to expenses.json");
            console.error("💡 Try: chmod 666 expenses.json (Linux/Mac)");
        } else if (error.code === 'ENOSPC') {
            console.error("❌ No disk space available");
        } else {
            console.error("❌ Error writing file:", error.message);
        }
        return false;
    }
}

/**
 * Handles the 'add' command - creates a new expense
 * Maneja el comando 'add' - crea un nuevo gasto
 * @param {Object} flags - Parsed flags / Flags parseadas
 */
async function handleAdd(flags) {
    const { description, amount, category } = flags;

    // Validate description / Validar descripción
    if (!description || description.trim().length === 0) {
        console.log("❌ Description cannot be empty");
        console.log("💡 Use: --description \"your description\"");
        showHelp();
        return;
    }

    // Validate amount / Validar monto
    if (!amount) {
        console.log("❌ Amount is required");
        console.log("💡 Use: --amount 20");
        return;
    }

    // Remove control characters / Eliminar caracteres de control
    const sanitizedDescription = description.replace(/[\x00-\x1F\x7F]/g, '');
    if (sanitizedDescription.length === 0) {
        console.log("❌ Description contains only invalid characters");
        return;
    }

    const expenses = await ReadExpenses();

    // Generate new ID (max existing ID + 1) / Generar nuevo ID (máximo ID existente + 1)
    const lastId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) : 0;
    const newId = lastId + 1;

    // Create new expense object / Crear nuevo objeto de gasto
    const NewExpense = {
        id: newId,
        description: sanitizedDescription,
        amount: amount,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format / Formato YYYY-MM-DD
        category: category || 'General'
    };

    expenses.push(NewExpense);
    await WriteExpenses(expenses);
    console.log(`✅ Expense added successfully with ID: ${newId}`);
}

/**
 * Handles the 'update' command - modifies an existing expense
 * Maneja el comando 'update' - modifica un gasto existente
 * @param {Object} flags - Parsed flags / Flags parseadas
 */
async function handleUpdate(flags) {
    const { id, description, amount } = flags;

    // Validate ID / Validar ID
    if (!id) {
        console.log("❌ --id is required to update an expense");
        showHelp();
        return;
    }
    
    // Validate at least one field to update / Validar al menos un campo a actualizar
    if (!description && !amount) {
        console.log("❌ At least one field (description or amount) must be provided to update");
        showHelp();
        return;
    }
    
    const expenses = await ReadExpenses();
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(id));
    
    // Check if expense exists / Verificar si el gasto existe
    if (expenseIndex === -1) {
        console.log(`❌ Expense with ID ${id} doesn't exist`);
        return;
    }

    // Update description if provided / Actualizar descripción si se proporciona
    if (description) {
        expenses[expenseIndex].description = description;
    }

    // Update amount if provided / Actualizar monto si se proporciona
    if (amount !== undefined && amount !== null) {
        expenses[expenseIndex].amount = amount;
    }
    
    await WriteExpenses(expenses);
    console.log(`✅ Expense ID ${id} updated successfully`);
}

/**
 * Handles the 'list' command - displays all expenses
 * Maneja el comando 'list' - muestra todos los gastos
 */
async function handleList() {
    const expenses = await ReadExpenses();

    if (expenses.length === 0) {
        console.log("❌ No expenses found.");
        showHelp();
        return;
    }
    
    // Sort by date (newest first) / Ordenar por fecha (más reciente primero)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display header / Mostrar encabezado
    console.log('\n===ALL EXPENSES===');
    console.log('ID'.padEnd(5) + 'Description'.padEnd(15) + 'Amount'.padEnd(10) + 'Date'.padEnd(10) + 'Category');
    
    // Display each expense / Mostrar cada gasto
    expenses.forEach(expense => {
        console.log(`${expense.id.toString().padEnd(5)} ${expense.description.padEnd(15)} $${expense.amount.toFixed(2).padEnd(5)} ${expense.date.padEnd(12)} ${expense.category}`);
    });
    
    // Calculate and display total / Calcular y mostrar total
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    console.log(`\n📊 Total: ${expenses.length} expenses | Sum: $${totalAmount.toFixed(2)}`);
}

/**
 * Handles the 'summary' command - shows expense totals
 * Maneja el comando 'summary' - muestra totales de gastos
 * @param {Object} flags - Parsed flags / Flags parseadas
 */
async function handleSummary(flags) {
    const { month } = flags;
    const expenses = await ReadExpenses();
    let total = 0;
    
    // Month names for display / Nombres de meses para mostrar
    const monthNames = ['January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();

    if (expenses.length === 0) {
        console.log("❌ No expenses found.");
        showHelp();
        return;
    }
    
    // If no month specified, show total for all expenses / Si no se especifica mes, mostrar total general
    if (month === null || month === undefined) {
        expenses.forEach(expense => {
            total = expense.amount + total;
        });
        console.log(`Total expenses: $${total.toFixed(2)}`);
    } else {
        // Filter expenses by month and current year / Filtrar gastos por mes y año actual
        const filteredExpenses = expenses.filter(e => {
            const expenseYear = new Date(e.date).getFullYear();
            const expenseMonth = new Date(e.date).getMonth() + 1;
            return expenseYear === currentYear && expenseMonth === month;
        });
        
        if (filteredExpenses.length === 0) {
            console.log(`❌ No expenses found for month: ${monthNames[month - 1]} ${currentYear}`);
            return;
        }
        
        // Calculate total for filtered expenses / Calcular total para gastos filtrados
        filteredExpenses.forEach(expense => {
            total = expense.amount + total;
        });
        console.log(`Total expenses for month ${monthNames[month - 1]} ${currentYear}: $${total.toFixed(2)}`);
    }
}

/**
 * Handles the 'delete' command - removes an expense
 * Maneja el comando 'delete' - elimina un gasto
 * @param {Object} flags - Parsed flags / Flags parseadas
 */
async function handleDelete(flags) {
    const { id } = flags;

    if (!id) {
        console.log("❌ --id is required to delete an expense");
        showHelp();
        return;
    }

    const expenses = await ReadExpenses();
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(id));

    if (expenseIndex === -1) {
        console.log(`❌ No expense found with ID: ${id}`);
        return;
    }

    // Remove expense from array / Eliminar gasto del array
    expenses.splice(expenseIndex, 1);

    await WriteExpenses(expenses);
    console.log(`✅ Expense with ID: ${id} deleted successfully`);
}

/**
 * Main function - entry point of the application
 * Función principal - punto de entrada de la aplicación
 */
async function main() {
    // Validate file before starting / Validar archivo antes de empezar
    const isValid = await validateExpensesFile();
    if (!isValid) {
        console.log("⚠️  Continuing with default behavior...");
    }

    // Parse command line arguments / Parsear argumentos de línea de comandos
    const args = process.argv.slice(2);
    const command = args[0];

    // Show help if no command provided / Mostrar ayuda si no se proporciona comando
    if (!command) {
        showHelp();
        return;
    }

    // List of valid commands / Lista de comandos válidos
    const validCommands = ['add', 'update', 'list', 'summary', 'delete'];
    if (!validCommands.includes(command)) {
        console.log(`❌ Unknown command: "${command}"`);
        showHelp();
        return;
    }
    
    try {
        // Command routing / Enrutamiento de comandos
        switch (command) {
            case 'add':
                try {
                    const flags = parseFlags(args);
                    await handleAdd(flags);
                } catch (error) {
                    console.error('❌ Error parsing flags:', error.message);
                    showHelp();
                }
                break;
                
            case 'update':
                try {
                    const flags = parseFlags(args);
                    await handleUpdate(flags);
                } catch (error) {
                    console.error('❌ Error parsing flags:', error.message);
                    showHelp();
                }
                break;
                
            case 'list':
                await handleList();
                break;
                
            case 'summary':
                try {
                    const flags = parseFlags(args);
                    await handleSummary(flags);
                } catch (error) {
                    console.error('❌ Error parsing flags:', error.message);
                    showHelp();
                }
                break;
                
            case 'delete':
                try {
                    const flags = parseFlags(args);
                    await handleDelete(flags);
                } catch (error) {
                    console.error('❌ Error parsing flags:', error.message);
                    showHelp();
                }
                break;
        }
    } catch (error) {
        // Handle unexpected errors / Manejar errores inesperados
        console.error('❌ Unexpected error:', error.message);
        console.error('💡 Please report this issue if it persists.');
    }
}

/**
 * Displays help information
 * Muestra información de ayuda
 */
function showHelp() {
    console.log(`
    Use: node expense-tracker.js <command> [options]
    
    Commands:
        add                           Add new expense
        list                          List all expenses
        delete  --id <id>              Delete expense
        update --id <id> [options]     Update expense
        summary [--month <month>]      View expense summary
    
    Options for 'add':
        --description "<text>"         Expense description (required)
        --amount <number>              Expense amount (required)
        --category "<text>"            Expense category (optional, default: general)
    
    Examples:
        node expense-tracker.js add --description "Lunch" --amount 15 --category food
        node expense-tracker.js add --description "Uber" --amount 25
        node expense-tracker.js list
        node expense-tracker.js summary --month 8
    `);
}

// Start the application / Iniciar la aplicación
main();