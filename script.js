// let draggedCard=null;
let rightClickedCard=null;
function addTask(columnId) {
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value;
    console.log(taskText);

    if (taskText==="") return;
    
    //date and time
    //toLocaleString() method returns a string with a 
    // language-sensitive representation of the date and time.
    const taskDate=new Date().toLocaleString();
    console.log(taskDate);
    const taskElement = createTaskElement(taskText,taskDate);

    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    
    // Clear the input field after adding the task
    input.value = "";
}

function createTaskElement(taskText,taskDate) {
    const taskElement = document.createElement("div");

    // Set the class name for styling
    taskElement.innerHTML=`<span>${taskText}</span><br><small class="time">${taskDate}</small>`;
    taskElement.classList.add("card");

    //for dragging
    //refrence of taskElement is changed 
    // when we use setAttribute so we can use property instead of attribute
    //taskElement.setAttribute("draggable",true);//another way
    taskElement.draggable=true;
    //drag start event
    taskElement.addEventListener("dragstart",dragStart);
    //drag end event PASTE
    taskElement.addEventListener("dragend",dragEnd);

    //right click event for delete and edit
    taskElement.addEventListener("contextmenu", ContextMenu);

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

//delte and edit task on right click
function ContextMenu(event){
    // Prevent the default context menu from appearing on right click
    event.preventDefault();
    rightClickedCard=this;
    //pageX and pageY gives the x and y coordinates of the mouse pointer relative to the whole document
    showContextMenu(event.pageX,event.pageY);
}
const menu=document.querySelector(".context-menu");
function showContextMenu(x,y){
    menu.style.display = "block";
    menu.style.left =`${x}px`;
    menu.style.top = `${y}px`;
}
document.addEventListener("click",()=>{
    menu.style.display="none";
});

//edit task function
function editTask(){
    //console.log(rightClickedCard);
    if(rightClickedCard!==null){
        const newtasktext=prompt("Edit task ",rightClickedCard.textContent);
        if(newtasktext!==null){
            rightClickedCard.textContent=newtasktext;
        }
    }
}

//delete task function
function deleteTask(){
    //console.log(rightClickedCard);
    if(rightClickedCard!==null){
        rightClickedCard.remove();
    }
}