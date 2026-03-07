# 💰 Expense Tracker CLI / CLI de Seguimiento de Gastos
  https://roadmap.sh/projects/expense-tracker

  A simple and powerful command-line expense tracker built with Node.js. Manage your finances with ease using a clean interface and persistent JSON storage.

  Un rastreador de gastos simple y potente para línea de comandos construido con Node.js. Gestiona tus finanzas fácilmente con una interfaz limpia y almacenamiento persistente en JSON.

  **Author / Autor:** [EdgarVz]

---

## 📦 Installation / Instalación

  #Clone the repository / Clonar el repositorio
  git clone https://github.com/EdgarVz/expense-tracker
  cd expense-tracker

  #nstall globally (recommended) / Instalar globalmente (recomendado)
  npm install -g .

  #Now you can use 'expense-tracker' from anywhere
  #Ahora puedes usar 'expense-tracker' desde cualquier lugar

## 🚀 Quick Start / Inicio Rápido

  ### Add an expense / Agregar un gasto
  expense-tracker add --description "Lunch" --amount 15 --category food

  ### List all expenses / Listar todos los gastos
  expense-tracker list

  ### Get total summary / Obtener resumen total
  expense-tracker summary

  ### Get summary for a specific month / Obtener resumen de un mes específico
  expense-tracker summary --month 8

  ### Update an expense / Actualizar un gasto
  expense-tracker update --id 1 --description "Dinner" --amount 25

  ### Delete an expense / Eliminar un gasto
  expense-tracker delete --id 1

## 📋 Commands / Comandos

|Command/Comando|Description/Descripción|
|:-|:-|
|add|Add a new expense/Agregar un nuevo gasto|
|list|List all expenses/Listar todos los gastos|
|update|Update an existing expense/Actualizar un gasto existente|
|delete|Delete an expense/Eliminar un gasto|
|summary|Show expense summary/Mostrar resumen de gastos|

### Options / Opciones

|Option/Opción|Required/Requerido|Description/Descripción|
|:-|:-|:-|
|--id <number>|✅ For update/delete Expense|ID / ID del gasto|
|--description "<text>"|✅ For add Expense|description/Descripción del gasto|
|--amount <number>|✅ For add	Expense|amount (positive number)/Monto del gasto (número positivo)|
|--category "<text>"|❌ Optional	Expense|category (default: General)/Categoría del gasto (por defecto: General)|
|--month <number>|❌ For summary|Month number (1-12)/Número de mes (1-12)|

## 💡 Examples / Ejemplos

  ### English

  #### Add expenses
  $ expense-tracker add --description "Lunch" --amount 15 --category food
  ✅ Expense added successfully with ID: 1

  $ expense-tracker add --description "Uber" --amount 25
  ✅ Expense added successfully with ID: 2

  $ expense-tracker add --description "Groceries" --amount 50 --category "supermarket"
  ✅ Expense added successfully with ID: 3

  #### List all expenses
  $ expense-tracker list

  ===ALL EXPENSES===
  ID    Description     Amount     Date       Category
  1     Lunch           $15.00     2024-03-15 food
  2     Uber            $25.00     2024-03-14 General
  3     Groceries       $50.00     2024-03-13 supermarket

  📊 Total: 3 expenses | Sum: $90.00

  #### Get total summary
  $ expense-tracker summary
  Total expenses: $90.00

  #### Get summary for August
  $ expense-tracker summary --month 8
  Total expenses for month August 2024: $45.00

  #### Update an expense
  $ expense-tracker update --id 2 --description "Taxi" --amount 30
  ✅ Expense ID 2 updated successfully

  #### Delete an expense
  $ expense-tracker delete --id 3
  ✅ Expense with ID: 3 deleted successfully

  ### Español

  #### Agregar gastos
  $ expense-tracker add --description "Almuerzo" --amount 15 --category comida
  ✅ Gasto agregado exitosamente con ID: 1

  $ expense-tracker add --description "Uber" --amount 25
  ✅ Gasto agregado exitosamente con ID: 2

  $ expense-tracker add --description "Supermercado" --amount 50 --category "compras"
  ✅ Gasto agregado exitosamente con ID: 3

  #### Listar todos los gastos
  $ expense-tracker list

  ===TODOS LOS GASTOS===
  ID    Descripción     Monto      Fecha      Categoría
  1     Almuerzo        $15.00     2024-03-15 comida
  2     Uber            $25.00     2024-03-14 General
  3     Supermercado    $50.00     2024-03-13 compras

  📊 Total: 3 gastos | Suma: $90.00

  #### Obtener resumen total
  $ expense-tracker summary
  Total de gastos: $90.00

  #### Obtener resumen de agosto
  $ expense-tracker summary --month 8
  Total de gastos para Agosto 2024: $45.00

  #### Actualizar un gasto
  $ expense-tracker update --id 2 --description "Taxi" --amount 30
  ✅ Gasto ID 2 actualizado exitosamente

  #### Eliminar un gasto
  $ expense-tracker delete --id 3
  ✅ Gasto con ID: 3 eliminado exitosamente

## 🛡️ Error Handling / Manejo de Errores

The application handles various scenarios gracefully:
La aplicación maneja varios escenarios adecuadamente:

|Scenario/Escenario|Response/Respuesta|
|:-|:-|
|✅ Missing description|❌ Description cannot be empty|
|✅ Missing amount|❌ Amount is required|
|✅ Negative amount|❌ Amount must be a positive number|
|✅ Invalid month|❌ Month must be between 1 and 12|
|✅ Non-existent ID|❌ No expense found with ID: X|
|✅ Empty expense list|❌ No expenses found|
|✅ Corrupted JSON|Creates backup and starts fresh / Crea backup y empieza de nuevo|
|✅ Permission issues|Suggests fix (chmod) / Sugiere solución (chmod)|

## 💾 Data Storage / Almacenamiento de Datos

Expenses are stored in expenses.json in the current directory:
Los gastos se almacenan en expenses.json en el directorio actual:

[
  {
    "id": 1,
    "description": "Lunch",
    "amount": 15.50,
    "date": "2024-03-15",
    "category": "food"
  }
]

## Features / Características:

  ✅ Auto-created if missing / Se crea automáticamente si falta

  ✅ Auto-repaired if corrupted / Se auto-repara si está corrupto

  ✅ Backup created before fixing / Se crea backup antes de reparar

  ✅ Human-readable format (pretty-printed) / Formato legible (con indentación)


## 🔧 Technical Details / Detalles Técnicos

  Language / Lenguaje: JavaScript (Node.js)

  Dependencies / Dependencias: None (pure Node.js) / Ninguna (Node.js puro)

  File system / Sistema de archivos: fs.promises

  Date handling / Manejo de fechas: Native Date object / Objeto Date nativo

  ID generation / Generación de IDs: Sequential (max ID + 1) / Secuencial (máximo ID + 1)

  Input sanitization / Sanitización: Removes control characters / Elimina caracteres de control

## 📁 Project Structure / Estructura del Proyecto

  expense-tracker/
  ├── expense-tracker.js    # Main application / Aplicación principal
  ├── expenses.json         # Data storage (auto-generated) / Datos (auto-generado)
  ├── package.json          # Project configuration / Configuración
  └── README.md            # This documentation / Esta documentación

## 🧪 Test It Yourself / Pruébalo Tú Mismo

  # 1. Add some expenses / Agregar algunos gastos
  expense-tracker add --description "Coffee" --amount 4 --category drinks
  expense-tracker add --description "Book" --amount 20 --category education
  expense-tracker add --description "Movie" --amount 12 --category entertainment

  # 2. View all expenses / Ver todos los gastos
  expense-tracker list

  # 3. Check total / Ver total
  expense-tracker summary

  # 4. Update an expense / Actualizar un gasto
  expense-tracker update --id 1 --description "Latte" --amount 5

  # 5. Delete an expense / Eliminar un gasto
  expense-tracker delete --id 3

  # 6. Verify changes / Verificar cambios
  expense-tracker list

## 🎯 Features Demonstrated / Características Demostradas

  ✅ Command-line argument parsing with flags / Parseo de argumentos con flags

  ✅ CRUD operations / Operaciones CRUD

  ✅ JSON file storage / Almacenamiento en archivo JSON

  ✅ Data validation / Validación de datos

  ✅ Error handling / Manejo de errores

  ✅ Monthly summaries / Resúmenes mensuales

  ✅ Categories / Categorías

  ✅ Professional UX (tables, formatting) / UX profesional (tablas, formato)

## 📚 What I Learned / Lo Que Aprendí

  Parsing complex command-line flags / Parsear flags complejas de línea de comandos

  Date manipulation in JavaScript / Manipulación de fechas en JavaScript

  Building professional CLI tools with excellent UX / Construir herramientas CLI profesionales con excelente UX

  Input sanitization and validation / Sanitización y validación de entrada

  File system operations with error handling / Operaciones de sistema de archivos con manejo de errores

## 📄 License / Licencia

  MIT © EdgarVz
