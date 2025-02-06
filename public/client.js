const insertButton = document.getElementById("insertButton");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

let todos = [];

const render = () => {
   todoList.innerHTML = "";
   todos.forEach(todo => {
       let className = "";
       let buttonText = "Completa"; // Testo del bottone se nn è completato
       
       if (todo.completed) {//controlla se completato
           className = "completed";//cambia stato
           buttonText = "Completato"; // cambia il nome del bottone
       }

       // Template per creare ul
       const template = 
           "<li class='" + className + "'>" +
               todo.name +
               "<button onclick='completeTodo(\"" + todo.id + "\")'>" + buttonText + "</button>" +
               "<button onclick='deleteTodo(\"" + todo.id + "\")'>Elimina</button>" +
           "</li>";
      // lo mostra nell html
       todoList.innerHTML += template;
   });
};

//funzione add todo
const send = (todo) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/add", {
         method: 'POST',
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(todo)
      })
      .then((response) => response.json())
      .then((json) => resolve(json));
   });
}

//funzione che carica i dati
const load = () => {
   return new Promise((resolve, reject) => {
      fetch("/todo")
      .then((response) => response.json())
      .then((data) => {
         todos = data.todos; 
         render(); // fa rendeer
         resolve(data);
      });
   });
}


//funzione completa todo
const completeTodo = (id) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/complete", {
         method: 'PUT',
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ id })
      })
      .then((response) => response.json())
      .then((json) => {
         todos.forEach(todo => {
            //controlla id del todo
            if (todo.id === id) {
               todo.completed = true;
            }
         });
         render();//chiama render
         resolve(json);
         //load()
      });
      
   });
}

//cancella id todo
const deleteTodo = (id) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/"+id, {
         method: 'DELETE',
         headers: {
            "Content-Type": "application/json"
         },
      })
      .then((response) => response.json())
      .then((json) => {
         for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
               todos.splice(i, 1); // lo toglie dalla lista
               break;
            }
         }
         render(); // chiama render
         resolve(json);
      });
   });
}

insertButton.onclick = () => {//quando clicco bottone
   const todo = {          //crea dizionario
      name: todoInput.value,
      completed: false
   }  
   send(todo) // 1. Invia la nuova Todo
    .then(() => load()) // 2. Ricarica la lista aggiornata
    .then((json) => { 
      todoInput.value = "";//azzera input 
   });
}

// Carica la lista iniziale
load().then((json) => {
   todos = json.todos;//lo mette in formato json dentro la lista
   render();//chiama render
});

// Aggiorna ogni 30 secondi
setInterval(() => {
   load().then((json) => {
      todos = json.todos;
      todoInput.value = "";//azzera input
      render();//chiama render
      console.log("ricarica")
   });
}, 30000);