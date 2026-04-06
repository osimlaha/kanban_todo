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
    return taskElement;
}