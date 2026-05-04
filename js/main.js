// we want the user to be able to inter the tasks 
// we wnat to display thoes tasks in ui ->

// the user should be able to delete and edit the tasks

// for the [reomve(icons)]

const ICONS = {
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
}; 


//loading from the localstorage 
document.addEventListener('DOMContentLoaded',()=>{
    const savedTasks = localStorage.getItem('myTasks')
    if(!savedTasks) return;
    const tasks = JSON.parse(savedTasks);
    tasks.forEach(task => { renderTaskCard(task)
        
    });
})


function renderTaskCard(task) {
    const container = document.getElementById('task-container');
    //my card
    const html = `
        <div class="card mb-3 shadow-sm border-0" id="task-${task.id}">
            <div class="card-body">
                <div class="row">
                    <div class="col mt-0"><h5 class="card-title">${task.title}</h5></div>
                    <div class="col-auto">
                    </div>
                </div>
                <h1 class="mt-1 mb-3">${task.value}</h1>
                <div class="mb-0">
                    <span class="text-success">Active</span>
                    
                    <button class="btn  float-end text-danger" onclick="deleteTask(${task.id})" class="btn text-danger">
                    ${ICONS.trash} 
                </button>
                </div>
            </div>
        </div>`;

    container.insertAdjacentHTML('afterbegin', html);
    
}


function deleteTask(id) {
    
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('myTasks', JSON.stringify(tasks));

    const taskElemnt =document.getElementById(`task-${id}`)
   if (taskElemnt) {
        taskElemnt.remove();
    }
}



function togglePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('active');
}


function handleSave() {
    const title = document.getElementById('task-input').value;
    const value = document.getElementById('value-input').value;

    if (title && value) {
        //creting an id and save to the localstorage
        const task = { id: Date.now(), title, value };
        
        const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
        tasks.push(task);
        localStorage.setItem('myTasks', JSON.stringify(tasks));

        renderTaskCard(task);
        
        //clear the windo
        document.getElementById('task-input').value = '';
        document.getElementById('value-input').value = '';
        togglePopup();
    } else {
        alert("Please fill in both fields!");
    }
}

