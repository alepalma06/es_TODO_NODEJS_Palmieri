const createMiddleware = () => {
    return {
        send: (todo) => {
            return new Promise((resolve, reject) => {
                fetch("/todo/add", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server all'aggiunta
                    })
            })
        },
        load: () => {
            return new Promise((resolve, reject) => {
                fetch("/todo")
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json); // risposta del server con la lista         
                    })
            })
        },
        put: (todo) => {
            return new Promise((resolve, reject) => {
                fetch("/todo/complete", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        },
        delete: (id) => {
            return new Promise((resolve, reject) => {
                fetch("/todo/" + id, {
                    method: 'DELETE'                
                })
                    .then((response) => response.json())
                    .then((json) => {
                        resolve(json);
                    })
            })
        }
    }
}

const createForm = (add) => {
    const inputInsert = document.querySelector("#inputInsert");
    const buttonInsert = document.querySelector("#buttonInsert");
    buttonInsert.onclick = () => {
        add(inputInsert.value);
        inputInsert.value = "";
    }
}

const createList = () => {
    const listItems = document.querySelector("#listItems");
    return {
        render: (todos, completeTodo, deleteTodo) => {
            listItems.innerHTML = todos.map(todo => `
                <li>
                    <span>${todo.name}</span>
                    <div>
                        <button class="btn btn-success btn-sm me-2" id="COMPLETE_${todo.id}">Completa</button>
                        <button class="btn btn-danger btn-sm" id="DELETE_${todo.id}">Elimina</button>
                    </div>
                </li>
            `).join("");

            todos.forEach(todo => {
                document.querySelector(`#COMPLETE_${todo.id}`).onclick = () => completeTodo(todo.id);
                document.querySelector(`#DELETE_${todo.id}`).onclick = () => deleteTodo(todo.id);
            });
        }
    }
};


const createBusinessLogic = (middleware, list) => {
    let todos = [];
    const reload = () => {
        middleware.load()
        .then((json) => {
            todos = json.todos;
            list.render(todos, completeTodo, deleteTodo);
        })
    }
    const completeTodo = (id) => {
        const todo = todos.filter((todo) => todo.id === id)[0];
        middleware.put(todo)
            .then(() => reload());
    }
    const deleteTodo =  (id) => {
        console.log("delete " + id);
        middleware.delete(id)
        .then(() => reload());
    }
    return {
        add: (task) => {
            const todo = {
                name: task,
                completed: false
            }
            middleware.send({ todo: todo })
                .then(() => reload());
        },
        reload: reload
    }
}

const middleware = createMiddleware();
const list = createList();
const businessLogic = createBusinessLogic(middleware, list);
const form = createForm(businessLogic.add);
businessLogic.reload();