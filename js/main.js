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
    const newestTasks = [...tasks].reverse().slice(0,3);
    newestTasks.forEach(task => { renderTaskCard(task)
    seemoreBtn()
    });
   
})

function loadingDashboard(){
    const container = document.getElementById('task-container');
    const seeMoreBtn = document.getElementById('see-more-link');
    
    container.innerHTML = ''; 

    
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

   
    [...tasks].reverse().slice(0, 3).forEach(task => renderTaskCard(task));

    // Show/Hide "See More" button
    if (seeMoreBtn) {
        seeMoreBtn.style.display = tasks.length > 3 ? 'block' : 'none';
    }
}

function seemoreBtn(){
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    const seeMoreBtn = document.getElementById('see-more-link');
    if (seeMoreBtn) {
        seeMoreBtn.style.display = tasks.length > 3 ? 'block' : 'none';
    }
}

function renderTaskCard(task) {
    const container = document.getElementById('task-container');
    const html = `
        <div class="card mb-3 shadow-sm border-0 task-card" 
             id="task-${task.id}" 
             onclick="selectSubject('${task.title}')" 
             style="cursor: pointer; transition: 0.3s;">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col">
                        <small class="text-primary-color fw-bold">Subject</small>
                        <h5 class="card-title fw-bold mb-0">${task.title}</h5>
                    </div>
                    <div class="col-auto">
                         <i class="bi bi-play-fill fs-3 text-primary-color"></i>
                    </div>
                </div>
                <div class="mt-2 d-flex justify-content-between align-items-center">
                    <span class="badge bg-light text-dark">${task.value} Hours Goal</span>
                    <button class="btn btn-link text-danger p-0" onclick="event.stopPropagation(); deleteTask(${task.id})">
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

   loadingDashboard()
}



function togglePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.toggle('active');
}


function handleSave() {
    const title = document.getElementById('subject-input').value;
    const value = document.getElementById('goal-input').value;

    if (title && value) {
        const task = { id: Date.now(), title, value };
        
        const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
        tasks.push(task);
        localStorage.setItem('myTasks', JSON.stringify(tasks));

        
        loadingDashboard();
        
       //clear the pop windo
        document.getElementById('subject-input').value = '';
        document.getElementById('goal-input').value = '';
        togglePopup();
    } else {
        alert("Please enter both the Subject and the Hour Goal!");
    }
}

function goToPlanner() {
    window.location.href = "index.html";

   
}



let timerInterval = null;
let secondsElapsed = 0;

function selectSubject(subjectName) {
    
    const activeSubjectName = document.querySelector('.card-body.text-center p.fw-bold');
    const statusText = document.querySelector('.card-body.text-center .text-muted.mb-4');
    
    if (activeSubjectName) activeSubjectName.innerText = subjectName;

    
    startTimer();
}

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    totalSeconds = 0; 

    timerInterval = setInterval(() => {
        totalSeconds++;

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.innerText = 
                `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function stopTimer() {
    clearInterval(timerInterval);
    totalSeconds = 0;
    document.getElementById('timer-display').innerText = "00:00:00";
}
