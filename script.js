// let draggedCard=null;
let rightClickedCard=null;

document.addEventListener("DOMContentLoaded",loadTasksFromLocalStorage);

function addTask(columnId) {
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value;
    //console.log(taskText);

    if (taskText==="") return;
    
    //date and time
    //toLocaleString() method returns a string with a 
    // language-sensitive representation of the date and time.
    const taskDate=new Date().toLocaleString();
    //console.log(taskDate);
    const taskElement = createTaskElement(taskText,taskDate);

    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    
    //update task count
    updateTaskCount(columnId);

    //save task to local storage
    saveTaskToLocalStorage(columnId,taskText,taskDate);

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
    ["todo","doing","done"].forEach((columnId)=>{
        updateTaskCount(columnId);
        updateLocalStorage(columnId);
    });
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
    //this.appendChild(draggedCard);
    
    //drag sorting- to insert card at current mouse position
    //check if there is any task under cursor
    //if yes insert before that task otherwise insert at end

    const afterElement=getDragAfterElement(this,event.clientY); 
    //return the element after which we have to insert the dragged card
    if(afterElement==null){
        this.appendChild(draggedCard);
    }else{
        this.insertBefore(draggedCard,afterElement);
    }
}
function getDragAfterElement(container,y){
    //get all draggable elements except the one being dragged
    const draggabeleElements=[
        ...container.querySelectorAll(".card:not(.dragging)"),
    ];// ... is spread operator which is used to convert node list to array
    // reduce method is used to find the closest element under the cursor
    const Result=draggabeleElements.reduce(
        (closetElementUnderCursor,currentTask)=>{
            //get the bounding box of current task
            const box=currentTask.getBoundingClientRect();
            //to get relative  position of cursor with respect to center of task
            const offset=y-(box.top+box.height/2);
            if(offset <0 && offset>closetElementUnderCursor.offset) {
                return {offset:offset,elemet:currentTask};
            }
            else{
                return closetElementUnderCursor;
            }
        },{offset:Number.NEGATIVE_INFINITY}
        //offset:Number.NEGATIVE_INFINITY ->
        // is used to initialize the offset to the smallest possible 
        // value so that any element above the cursor will be considered 
        // as a potential candidate for insertion point
    );
    return Result.elemet;
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
        const newtasktext=prompt("Edit task ",rightClickedCard.querySelector("span").textContent);
        console.log(rightClickedCard.querySelector("span").textContent);
        //console.log(rightClickedCard.textContent.text);
        if(newtasktext!==null){
            rightClickedCard.querySelector("span").textContent=newtasktext;
            rightClickedCard.querySelector("small").textContent=new Date().toLocaleString();
            const columnId=rightClickedCard.parentElement.id.replace("-tasks","");
            updateLocalStorage(columnId);
        }

    }
}

//delete task function
function deleteTask(){
    //console.log(rightClickedCard);
    const columnId=rightClickedCard.parentElement.id.replace("-tasks","");
    if(rightClickedCard!==null){
        rightClickedCard.remove();

        updateLocalStorage(columnId);
        updateTaskCount(columnId);
        
    }
}

//update no of tasks in column
//count update in three cases
//1. when task is added
//2. when task is deleted
//3. when task is moved from one column to another
function updateTaskCount(columnId){
    const count=document.querySelectorAll(`#${columnId}-tasks .card`).length;
    document.getElementById(`${columnId}-count`).textContent=count;
}

//save data in local storage
function saveTaskToLocalStorage(columnId,taskText,taskDate){
    const tasks=JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.push({text:taskText,date:taskDate});
    localStorage.setItem(columnId,JSON.stringify(tasks));
    //here columnId is key 
    // and value is array of objects which contains text 
    // and date of task
}

//load data from local storage
function loadTasksFromLocalStorage(){
    ["todo","doing","done"].forEach((columnId)=>{
        // console.log(columnId);
        // console.log(localStorage.getItem(columnId));
        const tasks=JSON.parse(localStorage.getItem(columnId)) || [];
        tasks.forEach(({text,date})=>{
            const taskElement=createTaskElement(text,date);
            document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
        });
        updateTaskCount(columnId);
    });
}
//load tasks when page loads
function updateLocalStorage(columnId){
    // ["todo","doing","done"].forEach((columnId)=>{
        const tasks=[];
        document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card)=>{
            const taskText=card.querySelector("span").textContent;
            const taskDate=card.querySelector("small").textContent;
            tasks.push({text:taskText,date:taskDate});
        });
        localStorage.setItem(columnId,JSON.stringify(tasks));
    
}