document.getElementById("addTaskButton").addEventListener("click", addtask)
document.getElementById("removeTaskButton").addEventListener("click", removeTask)

function addtask() {
    let task = document.getElementById("taskInput").value

    let listItem = document.createElement("li");
    listItem.textContent = task

    document.getElementById('taskList').appendChild(listItem)
}
function removeTask() {
    let task = document.getElementById("taskInput").value;
    let taskList = document.getElementById('taskList');
    let listItems = taskList.getElementsByTagName('li');

    for (let i = 0; i < listItems.length; i++){
        if (listItems[i].textContent === task) {
            taskList.removeChild(listItems[i]);
            return
        }
    }
    document.getElementById('taskList').appendChild(listItem)
}
