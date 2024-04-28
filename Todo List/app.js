
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");
const filterInput = document.querySelector("#todoSearch");

let todos = [];

runEvents(); //Eventleri çalıştıracak metot

function runEvents() {
    form.addEventListener("submit", addTodo); // Formda submit yapıldığında addTodo metodunu çalıştıracak.
    document.addEventListener("DOMContentLoaded",pageLoaded);
    secondCardBody.addEventListener("click",removeTodoToUI);
    clearButton.addEventListener("click", allTodosEverywhere);
    filterInput.addEventListener("keyup",filter);
}

function pageLoaded(){ //sayfa yüklendiğinde todoları storageden almak için yazılan metot.
    checkTodosFromStorage();
    todos.forEach(function(todo){
        addTodoUI(todo);
    });
}

function filter(e){ //filtrelemek için yazılan kod.
   const filterValue = e.target.value.toLowerCase().trim();
   const todoListesi = document.querySelectorAll(".list-group-item");

   if(todoListesi.length>0){
    todoListesi.forEach(function(todo){
        if(todo.textContent.toLowerCase().trim().includes(filterValue)){
            todo.setAttribute("style","display:block");
        } else{
            todo.setAttribute("style","display:none !important");
        }
    });
   }else{
    showAlert("warning","Filtreleme yapmak için en az bir Todo olmalıdır.");
   }
}

function allTodosEverywhere(){ // Varsa tüm todoları silmek için yazılan kod. Yoksa uyarı döner.
    const todoListesi = document.querySelectorAll(".list-group-item");
    if(todoListesi.length>0){
        //ekrandan silme
        todoListesi.forEach(function(todo){
            todo.remove();
        });

        // storageden silme
        todos = [];
        localStorage.setItem("todos",JSON.stringify(todos));
        showAlert("success","Başarı ile tüm Todo'lar silinmiştir.")
    }else{
        showAlert("warning","Silmek için en az bir todo olmalıdır.")
    }
}

function removeTodoToUI(e){ // çarpıya basıldığında silinmesi için yazılan metot.
    if(e.target.className==="fa fa-remove"){
        // Ekrandan silme
        const todo = e.target.parentElement.parentElement;
        todo.remove();
        //Storageden silme
        removeTodoToStorage(todo.textContent);
        showAlert("success", "Başarı ile silinmiştir.")
    }
}

function removeTodoToStorage(removeTodo){
    checkTodosFromStorage();
    todos.forEach(function(todo, index){
        if(removeTodo===todo){
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}

function addTodo(e) {
    const inputText = addInput.value.trim();
    if (inputText == null | inputText == "") {
        showAlert("warning","Lütfen bir değer giriniz.") //İnputa gelen değerin kontrolünü sağladık.
    } else {
        //Arayüz ekleme
        addTodoUI(inputText);
        // Storage ekleme (Sayfa yenilendiğinde değer gitmemesi için)
        addTodoStorage(inputText);
        showAlert("success", "Todo Eklendi");

    }
    e.preventDefault(); // Submit yapıldığında farklı bir sayfaya yönlendirilmesi engellendi.
}

function addTodoUI(newTodo) { //Arayüz ekleme başarılı olduğunda çalışacak metot
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = newTodo;

    const a = document.createElement("a");
    a.href = "#";
    a.className = "delete-item";

    const i = document.createElement("i");
    i.className = "fa fa-remove";

    a.appendChild(i);
    li.appendChild(a);
    todoList.appendChild(li);

    addInput.value = ""; //Ekleme yapıldıktan sonra input boşaltıldı.

}

function addTodoStorage(newTodo) { //yeni eklenen değeri, checkTodosFromStorage metodu kontrol ettikten sonra set edecek.
    checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function checkTodosFromStorage() { // local storagede todos değeri var mı diye kontrol ederek yoksa temiz olarak başlatacak varsa dolu olarak getirecek.
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

function showAlert(type, message) { //Alert kontrolleri oluşturma,kaybolma vb. kontroller için yazılan metot.
    // <div class="alert alert-warning" role="alert">
    //     This is a warning alert—check it out!
    // </div>
    const div = document.createElement("div");
    div.className = "alert alert-" + type; 
    div.textContent = message;

    firstCardBody.appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);
}

