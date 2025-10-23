const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Funções principais
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    todos.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTodos();
    renderTodos();
    todoInput.value = '';
}

function completoTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    if (confirm('Excluir tarefa?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    }
}

function applyFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter)); // CORRIGIDO: toggle em vez de completo
    renderTodos();
}

function renderTodos() {
    let filteredTodos = todos;
    
    if (currentFilter === 'completed') filteredTodos = todos.filter(todo => todo.completed);
    else if (currentFilter === 'pending') filteredTodos = todos.filter(todo => !todo.completed);

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">Nenhuma tarefa encontrada...</li>';
    } else {
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="completoTodo(${todo.id})">
                <span>${todo.text}</span>
                <button onclick="deleteTodo(${todo.id})">🗑️</button>
            </li>
        `).join('');
    }
    
    updateStats();
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = `Total: ${total}`;
    completedTasksEl.textContent = `Concluídas: ${completed}`;
    pendingTasksEl.textContent = `Pendentes: ${pending}`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();
}

// Eventos
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', e => e.key === 'Enter' && addTodo());
filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

// Iniciar
renderTodos();