// we want the user to be able to inter the tasks 
// we wnat to display thoes tasks in ui ->
// the user should be able to delete the tasks from the plan

//  the user click on the go to planner btn then inter-> 
//  his name then hola he is inside the dashbard
//there is a summery in the top-> the number of the subject logic is done

// we may need like 6to8 api 
//we will use nodejs and mango atlas or use (nodejs express sever)
//



// for the [reomve(icons)]

const ICONS = {
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
}; 


//loading from the localstorage 
document.addEventListener('DOMContentLoaded',()=>{
    displayUserName();
    const savedTasks = localStorage.getItem('myTasks')
    
    if(!savedTasks) return;
    const tasks = JSON.parse(savedTasks);
    const newestTasks = [...tasks].reverse().slice(0,3);
    newestTasks.forEach(task => { renderTaskCard(task)
    seemoreBtn()
    });
   updateStats();
   updateTotalhours();
   updateActualStats();
   
   
})

function loadingDashboard(){
    const container = document.getElementById('task-container');
    const seeMoreBtn = document.getElementById('see-more-btn');
    
    container.innerHTML = ''; 

    
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

   
    [...tasks].reverse().slice(0, 3).forEach(task => renderTaskCard(task));

    // Show/Hide "See More" button
if (seeMoreBtn) {
        if (tasks.length > 3) {
            seeMoreBtn.classList.remove('d-none');
            seeMoreBtn.style.display = "block"; // Extra insurance
        } else {
            seeMoreBtn.classList.add('d-none');
            seeMoreBtn.style.display = "none";
        }
    }
}

function seemoreBtn(){
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    const seeMoreBtn = document.getElementById('see-more-link');
    if (seeMoreBtn) {
        seeMoreBtn.style.display = tasks.length > 3 ? 'block' : 'none';
    }
}
function startStudySession(subjectName, hourGoal) {
    localStorage.setItem('activeSubject', subjectName);
    const seconds = hourGoal > 0 ? (hourGoal * 60 * 60) : 1500;
    localStorage.setItem('customTimerSeconds', seconds);
    window.location.href = "NewSession.html"; 
}
function renderTaskCard(task) {
    const container = document.getElementById('task-container');
    const html = `
        <div class="card mb-3 shadow-sm border-0 task-card" 
             id="task-${task.id}" 
             onclick="selectSubject('${task.title}','${task.value}')" 
             style="cursor: pointer; transition: 0.3s;">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col">
                        <small class="text-primary-color fw-bold">Subject</small>
                        <h5 class="card-title fw-bold mb-0">${task.title}</h5>
                    </div>
                    <div class="col-auto" style="cursor: pointer;" onclick="startStudySession('${task.title}', ${task.value})">
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

    container.insertAdjacentHTML('beforeend', html);
}


function deleteTask(id) {
    
    let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    tasks = tasks.filter(t => t.id !== id);

    localStorage.setItem('myTasks', JSON.stringify(tasks));
//checking when we are in the alltask veiw
   const allTasksView = document.getElementById('view-all-tasks');
    
    if (allTasksView && allTasksView.style.display === 'block') {
        
        renderFullTaskList(); 
    } else {
       
        loadingDashboard();
    }
    updateStats();
    updateTotalhours();
}



function openModal() {
    const modal = document.getElementById('popupOverlay');
    modal.style.display = 'flex'; // Use flex to center it
    modal.classList.add('active');
    // Small delay to trigger the scale animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModalwindo() {
    // Make sure this selector matches your NEW coffee html class
    const modal = document.querySelector('.modal-overlay'); 
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
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
         updateStats()
         updateTotalhours();
        //  finalizeSession();
       //clear the pop windo

        document.getElementById('subject-input').value = '';
        document.getElementById('goal-input').value = '';
          closeModalwindo();

    } else {
        alert("Please enter both the Subject and the Hour Goal!");
    }

}

//this for the landing page <3


function goToPlanner() {
    document.getElementById('nameModal').style.display = 'flex';
    document.getElementById('userNameInput').focus();
}


function closeModal() {
    document.getElementById('nameModal').style.display = 'none';
}


function saveAndGo() {
    const input = document.getElementById('userNameInput');
    const name = input.value.trim();

    if (name) {
        localStorage.setItem('studyPlannerUser', name);
        input.value = '';
        window.location.href = "index.html"; 
    } else {
        alert("Please enter a name to continue!");
    }
}

//END of the goto sudyplanner page

// let secondsElapsed = 0; 
// let timerInterval = null;

function selectSubject(subjectName,hourGoal) {
    const hours = parseFloat(hourGoal) || 0;
    localStorage.setItem('activeSubject', subjectName);//saving to the localstorage
    localStorage.setItem('activeGoal',String(sessionsNeeded)); // Save the hours too!

    window.location.href = "Sessions.html";
    // const activeSubjectName = document.querySelector('.card-body.text-center p.fw-bold');
    // const statusText = document.querySelector('.card-body.text-center .text-muted.mb-4');
    
    // if (activeSubjectName) activeSubjectName.innerText = subjectName;

    // secondsElapsed = 0;
    // startTimer();
}

//timer

// function startTimer() {
//     if (timerInterval) clearInterval(timerInterval);

//     timerInterval = setInterval(() => {
//         secondsElapsed++;

//         const hrs = Math.floor(secondsElapsed / 3600);
//         const mins = Math.floor((secondsElapsed % 3600) / 60);
//         const secs = secondsElapsed % 60;

//         const timerDisplay = document.getElementById('timer-display');
//         if (timerDisplay) {
//             timerDisplay.innerText = 
//                 `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//         }
//     }, 1000);
// }

// function pauseTimer() {
//     clearInterval(timerInterval);
// }

// function stopTimer() {
//     clearInterval(timerInterval);
//     totalSeconds = 0;
//     document.getElementById('timer-display').innerText = "00:00:00";
// }

//view nevagtion

function showView(viewId) {
    const dashboard = document.getElementById('view-dashboard');
    const allTasks = document.getElementById('view-all-tasks');
const navLinks = document.querySelectorAll('.sidebar .nav-link');
    if (dashboard && allTasks) {
        if (viewId === 'view-dashboard') {
            dashboard.style.display = 'block';
            allTasks.style.display = 'none';
            if (typeof loadingDashboard === "function") loadingDashboard();
        } else {
            dashboard.style.display = 'none';
            allTasks.style.display = 'block';
            if (typeof renderFullTaskList === "function") renderFullTaskList();
        }
    }

   if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.classList.add('text-white-50');
            link.classList.remove('text-white', 'fw-bold');
            
            const clickAttr = link.getAttribute('onclick');
            if (clickAttr && clickAttr.includes(viewId)) {
                link.classList.remove('text-white-50');
                link.classList.add('text-white', 'fw-bold');
            }
        });
    }
}
//render function for the all tasks veiw
function renderFullTaskList() {
    const container = document.getElementById('full-task-list');
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    container.innerHTML = ''; 

    if (tasks.length === 0) {
        container.innerHTML = '<div class="text-center w-100 mt-5"><h4>No tasks found.</h4></div>';
        return;
    }

    [...tasks].reverse().forEach(task => {
        const cardHtml =  `
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
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}
//function for the number of subject
 function updateStats(){
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    const countElement = document.getElementById('subject-count');
    if (countElement) {
        countElement.innerText = tasks.length;
    }
 }
 // function for the toal hours
 function updateTotalhours(){
    const tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    const timeElement = document.getElementById('total-study-hours');
    if (timeElement) {
        const totalHours = tasks.reduce((sum, task) => {
            return sum + (Number(task.value) || 0);
        }, 0);

        timeElement.innerText = `${totalHours}h`;
    }
 }


// Updates the Daily Goal 

// function finalizeSession() {
//     clearInterval(timerInterval);
    
//     let currentTotal = parseInt(localStorage.getItem('totalSecondsStudied')) || 0;
    
//     let newTotal = currentTotal + secondsElapsed;
    
//     localStorage.setItem('totalSecondsStudied', newTotal);
    
//     secondsElapsed = 0;
//     const timerDisplay = document.getElementById('timer-display');
//     if (timerDisplay) timerDisplay.innerText = "00:00:00";
    
//     updateActualStats();
// }

function updateActualStats() {
    const totalSeconds = parseInt(localStorage.getItem('totalSecondsStudied')) || 0;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    
    const displayElement = document.getElementById('actual-study-time');
    if (displayElement) {
        displayElement.innerText = `${hrs}h ${mins.toString().padStart(2, '0')}m`;
    }
}


 function displayUserName() {

    const savedName = localStorage.getItem('studyPlannerUser');
    const nameElement = document.getElementById('user-display-name');

    if (savedName && nameElement) {
        nameElement.innerText = savedName;
    }
}