(function () {
    // Globals
    const todoList = document.getElementById('todo-list')
    const userSelect = document.getElementById('user-todo')
    const form = document.querySelector('form')
    const input = document.getElementById('new-todo')
    let todos = [];
    let users = [];

    // Attach Events
    document.addEventListener('DOMContentLoaded', initApp);
    form.addEventListener('submit', handleSubmit)

    // Basic logic
    function getUserName(userId) {
        const user = users.find(u => u.id === userId)
        return user.name
    }

    function printTodo({ id, userId, title, completed }) {
        const li = document.createElement('li')
        li.className = 'todo-item'
        li.dataset.id = id;
        li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}</b></span>`


        const div = document.createElement('div')
        div.className = 'div_close'
        div.addEventListener('click', handleClose)

        const status = document.createElement('input')
        status.className = 'status'
        status.type = 'checkbox'
        status.checked = completed;
        status.addEventListener('change', handleTodoChange)

        const close = document.createElement('span')
        close.innerHTML = '&times;'
        close.className = 'close'
        

        div.appendChild(close)
        li.prepend(status)
        li.append(div)

        todoList.prepend(li)


    }

    function createUserOption(user) {
        const option = document.createElement('option')
        option.value = user.id
        option.innerHTML = user.name

        userSelect.append(option)
    }

    // Event Logic
    function handleSubmit(event) {
        event.preventDefault()
        
        createTodo({
            "userId": Number(form.user.value),
            "title": form.todo.value,
            "completed": false
        })
        input.value = ''
    }

    function initApp() {
        Promise.all([gerAllTodos(), gerAllUsers()]).then(values => {
            [todos, users] = values // Возвращается массив

            // Отправить в разметку
            todos.forEach(todo => printTodo(todo))
            users.forEach(user => createUserOption(user))
        })
    }


    function handleTodoChange() {
        const todoId = this.parentElement.dataset.id
        const completed = this.checked


        toggleTodoComplete(todoId, completed)
    }

    function handleClose() {
        const todoId = this.parentElement.dataset.id
        deleteTodo(todoId)
    }

    function removeTodo(todoId) {
        todos = todos.filter(todo => todo.id !== todoId);

        const todo = todoList.querySelector(`[data-id="${todoId}"]`)

        todo.querySelector('input').removeEventListener('change', handleTodoChange)
        todo.querySelector('.close').removeEventListener('click', handleClose)

        todo.remove()
    }

    function alertError(error) {
        alert(error.message)
    }


    // Async
    async function gerAllTodos() {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=15')
        const data = await response.json()

        return data;
    }

    async function gerAllUsers() {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = await response.json()

        return data;
    }

    async function createTodo(todo) {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const newTodo = await response.json()
        // console.log(newTodo);

        printTodo(newTodo)
    };

    async function toggleTodoComplete(todoId, completed) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: 'PATCH',
                body: JSON.stringify({ completed: completed }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (!response.ok) {
                // Error
                throw new Error('Failed to connect')
            }
        } catch (error) {
            alertError(error)
        }



    }

    async function deleteTodo(todoId) {
       
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })


            if (response.ok) {
                // Remote from DOM
                removeTodo(todoId)
            } 

    }
})()

