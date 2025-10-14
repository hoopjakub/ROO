/*
ZADANIE - TODOAPP

- pridanie uloh
- upravovanie uloh
- mazanie uloh
- dynamicky rozlisovat ulohy ktore su done/undone - pomocou stylov
- vsetky elementy budu vytvorene / upravene / mazané dynamicky cez JS
- treba aby boli polozky perzistentne, pomocou localStorage .get a .set, aby zostal stav uloh aj po refreshi stranky
*/

class TodoApp {
    constructor() {
        this.todos = [];
        this.nextId = 1;
        this.init();
    }

    init() {
        this.createHTMLStructure();
        this.addStyles();
        this.loadTodos();
        this.bindEvents();
        this.render();
    }

    createHTMLStructure() {
        document.body.innerHTML = '';
        
        const container = document.createElement('div');
        container.id = 'todo-container';
        
        const title = document.createElement('h1');
        title.textContent = 'Todo App';
        container.appendChild(title);
        
        const inputSection = document.createElement('div');
        inputSection.id = 'input-section';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'todo-input';
        input.placeholder = 'Pridajte novú úlohu...';
        
        const addButton = document.createElement('button');
        addButton.id = 'add-btn';
        addButton.textContent = 'Pridať';
        
        inputSection.appendChild(input);
        inputSection.appendChild(addButton);
        container.appendChild(inputSection);
        
        const todoList = document.createElement('div');
        todoList.id = 'todo-list';
        container.appendChild(todoList);
        
        document.body.appendChild(container);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            
            #todo-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            h1 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
            }
            
            #input-section {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            #todo-input {
                flex: 1;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
            }
            
            #todo-input:focus {
                outline: none;
                border-color: #007bff;
            }
            
            button {
                padding: 10px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            button:hover {
                background: #0056b3;
            }
            
            .todo-item {
                display: flex;
                align-items: center;
                padding: 15px;
                margin-bottom: 10px;
                background: #f8f9fa;
                border-radius: 4px;
                border-left: 4px solid #007bff;
            }
            
            .todo-item.done {
                background: #d4edda;
                border-left-color: #28a745;
                opacity: 0.8;
            }
            
            .todo-item.done .todo-text {
                text-decoration: line-through;
                color: #6c757d;
            }
            
            .todo-checkbox {
                margin-right: 15px;
                transform: scale(1.2);
            }
            
            .todo-text {
                flex: 1;
                font-size: 16px;
                color: #333;
            }
            
            .todo-text.editing {
                background: white;
                border: 1px solid #007bff;
                border-radius: 4px;
                padding: 5px;
            }
            
            .todo-actions {
                display: flex;
                gap: 5px;
            }
            
            .edit-btn {
                background: #28a745;
                font-size: 12px;
                padding: 5px 10px;
            }
            
            .edit-btn:hover {
                background: #1e7e34;
            }
            
            .delete-btn {
                background: #dc3545;
                font-size: 12px;
                padding: 5px 10px;
            }
            
            .delete-btn:hover {
                background: #c82333;
            }
            
            .save-btn {
                background: #007bff;
                font-size: 12px;
                padding: 5px 10px;
            }
            
            .cancel-btn {
                background: #6c757d;
                font-size: 12px;
                padding: 5px 10px;
            }
            
            .empty-state {
                text-align: center;
                color: #6c757d;
                font-style: italic;
                padding: 40px;
            }
        `;
        document.head.appendChild(style);
    }

    loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
            this.nextId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo(text) {
        if (text.trim() === '') return;
        
        const todo = {
            id: this.nextId++,
            text: text.trim(),
            done: false
        };
        
        this.todos.push(todo);
        this.saveTodos();
        this.render();
        
        document.getElementById('todo-input').value = '';
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.done = !todo.done;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    editTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo && newText.trim() !== '') {
            todo.text = newText.trim();
            this.saveTodos();
            this.render();
        }
    }

    render() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        
        if (this.todos.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'Žiadne úlohy. Pridajte prvú úlohu!';
            todoList.appendChild(emptyState);
            return;
        }
        
        this.todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            todoList.appendChild(todoItem);
        });
    }

    createTodoElement(todo) {
        const item = document.createElement('div');
        item.className = `todo-item ${todo.done ? 'done' : ''}`;
        item.dataset.id = todo.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.done;
        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        
        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;
        
        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Upraviť';
        editBtn.addEventListener('click', () => this.startEditing(todo.id, text));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Zmazať';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Naozaj chcete zmazať túto úlohu?')) {
                this.deleteTodo(todo.id);
            }
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(actions);
        
        return item;
    }

    startEditing(id, textElement) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-text editing';
        input.value = todo.text;
        
        const actions = textElement.parentNode.querySelector('.todo-actions');
        actions.innerHTML = '';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Uložiť';
        saveBtn.addEventListener('click', () => {
            this.editTodo(id, input.value);
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Zrušiť';
        cancelBtn.addEventListener('click', () => {
            this.render();
        });
        
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        
        textElement.parentNode.replaceChild(input, textElement);
        input.focus();
        input.select();
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.editTodo(id, input.value);
            } else if (e.key === 'Escape') {
                this.render();
            }
        });
    }

    bindEvents() {
        const addBtn = document.getElementById('add-btn');
        const input = document.getElementById('todo-input');
        
        addBtn.addEventListener('click', () => {
            this.addTodo(input.value);
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addTodo(input.value);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});