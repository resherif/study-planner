let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
let savedCustomTime = localStorage.getItem('customTimerSeconds');
let activeSubject = localStorage.getItem('activeSubject') || "Deep Work Session";
let timeLeft = savedCustomTime ? parseInt(savedCustomTime) : 1500;
let timerId = null;
const display = document.getElementById('display');
const startBtn = document.getElementById('start');

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sessions page loaded. Checking for data...");
    renderSessions();
    updateStats();
    
});


function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    let displayString = "";
    if (hours > 0) {
        displayString += `${hours}:`;
    }
    displayString += `${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    display.textContent = displayString;
    
}
function startTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'START';
    } else {
        startBtn.textContent = 'PAUSE';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
        
            if (timeLeft <= 0) {
                clearInterval(timerId);
                handleSessionCompletion();
            }
        }, 1000);
    }
}

// function handleSessionCompletion() {
//     let completedCount = localStorage.getItem('completedSessions') || 0;
    
//     localStorage.setItem('completedSessions', parseInt(completedCount) + 1);
//     localStorage.setItem('finished-' + activeSubject, 'true');
//     const newSession = {
//         id: Date.now(),
//         title: activeSubject,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         category: "Study",
//         status: "Completed",
//         icon: "fa-check-circle"
//     };
//     sessions.unshift(newSession);
//     localStorage.setItem('studySessions', JSON.stringify(sessions));
//     localStorage.removeItem('customTimerSeconds');
//     alert(`Great job! You finished your session for: ${activeSubject}`);
//     window.location.href = "Sessions.html"; 
// }

document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.mode-btn.active').classList.remove('active');
        button.classList.add('active');
        timeLeft = parseInt(button.dataset.time);
        localStorage.removeItem('customTimerSeconds'); 
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        startBtn.textContent = 'START';
        updateDisplay();
    });
});

document.getElementById('reset').addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (savedCustomTime) {
        timeLeft = parseInt(savedCustomTime);
    } else {
        const activeTime = document.querySelector('.mode-btn.active').dataset.time;
        timeLeft = parseInt(activeTime);
    }
    startBtn.textContent = 'START';
    updateDisplay();
});

updateDisplay();
startBtn.addEventListener('click', startTimer);

function handleSessionCompletion() {
    // 1. Calculate time spent
    const originalTime = savedCustomTime ? parseInt(savedCustomTime) : 1500;
    const minutesSpent = Math.floor(originalTime / 60);

    // 2. Update Total Minutes
    let totalMinutes = parseInt(localStorage.getItem('totalStudyMinutes')) || 0;
    totalMinutes += minutesSpent;
    localStorage.setItem('totalStudyMinutes', totalMinutes);

    // 3. Update Session Count
    let completedCount = parseInt(localStorage.getItem('completedSessions')) || 0;
    localStorage.setItem('completedSessions', completedCount + 1);

    // 4. THE IMPORTANT FLAG: Tells the Dashboard this subject is done
    localStorage.setItem('finished-' + activeSubject, 'true');

    // 5. Create Session History Object
    const newSession = {
        id: Date.now(),
        title: activeSubject,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: "Study", // Keep your categories consistent
        status: "Completed",
        icon: "fa-check-circle"
    };

    // 6. Save to History Array
    sessions.unshift(newSession);
    localStorage.setItem('studySessions', JSON.stringify(sessions));

    // 7. Cleanup
    localStorage.removeItem('customTimerSeconds');

    // 8. Alert and Redirect
    alert(`Great job! You finished: ${activeSubject}`);
    window.location.href = "sessions.html"; // Make sure this points to your Dashboard!
}


function renderSessions() {
    const container = document.getElementById('sessionsContainer');
    const emptyState = document.getElementById('emptyState');
    
    // 1. Get the sessions from localStorage
    const sessions = JSON.parse(localStorage.getItem('studySessions')) || [];

    // 2. Show empty state if no sessions exist
    if (sessions.length === 0) {
        emptyState.classList.remove('hidden');
        container.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = '';

    // 3. Loop through sessions and create HTML cards
    sessions.forEach(session => {
        const sessionCard = `
            <div class="stat-card session-history-card">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="stat-label">${session.time}</p>
                        <h3 class="text-xl font-bold text-coffee">${session.title}</h3>
                    </div>
                    <span class="badge bg-success text-white">Completed</span>
                </div>
                <div class="mt-4 flex items-center text-sm text-gray-500">
                    <i class="fas fa-coffee mr-2"></i>
                    <span>Productive Session</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', sessionCard);
    });
}

function updateStats() {
    // Update the "Completed Sessions" count at the top
    const completedCount = localStorage.getItem('completedSessions') || 0;
    document.getElementById('sessionCount').textContent = `${completedCount} Sessions`;

    // Update the Progress Bar (Assuming a goal of 20)
    const goal = 20;
    const progressPercent = Math.min((completedCount / goal) * 100, 100);
    
    document.getElementById('weeklyGoal').textContent = `${completedCount}/${goal}`;
    document.getElementById('goalBar').style.width = `${progressPercent}%`;
}
function saveSessionTime(minutesSpent) {
    let totalMinutes = parseInt(localStorage.getItem('totalStudyMinutes')) || 0;
    
    totalMinutes += minutesSpent;
    
    localStorage.setItem('totalStudyMinutes', totalMinutes);
}

// function finishSession(subjectName) {
//     // Save that this specific subject is finished
//     localStorage.setItem('status-' + subjectName, 'completed');
    
// }