// let draggedCard=null;
function addTask(columnId) {
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value;
    console.log(taskText);

    if (taskText==="") return;
    
    const taskElement = createTaskElement(taskText);

    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    
    // Clear the input field after adding the task
    input.value = "";
}

function createTaskElement(taskText) {
    const taskElement = document.createElement("div");

    // Set the class name for styling
    taskElement.classList.add("card");
    taskElement.textContent = taskText;

    //for dragging
    //refrence of taskElement is changed 
    // when we use setAttribute so we can use property instead of attribute
    //taskElement.setAttribute("draggable",true);//another way
    taskElement.draggable=true;
    //drag start event
    taskElement.addEventListener("dragstart",dragStart);
    //drag end event PASTE
    taskElement.addEventListener("dragend",dragEnd);
    return taskElement;
}

//drag start function
function dragStart(){
    this.classList.add("dragging");
    // Set the reference to the dragged card
    // draggedCard=this;
}
//drag end function
function dragEnd(){
    this.classList.remove("dragging");
    // Clear the reference to the dragged card
    // draggedCard=null;
}
//drag over event for columns
const columns=document.querySelectorAll(".column .task");
columns.forEach((column)=>{
    column.addEventListener("dragover",dragOver);
});
function dragOver(event){
    event.preventDefault();
    //in palce of storing draggedcard varibale to store refrence of dragged card
    // we can directly used querySlector to get the reference of dragged card
    const draggedCard=document.querySelector(".dragging");
    this.appendChild(draggedCard);
}
