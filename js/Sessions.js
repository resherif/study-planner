// --- 1. المتغيرات الأساسية ---
let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
let savedCustomTime = localStorage.getItem('customTimerSeconds');
let activeSubject = localStorage.getItem('activeSubject') || "Deep Work Session";
let timeLeft = savedCustomTime ? parseInt(savedCustomTime) : 1500;
let timerId = null;
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const container = document.getElementById('sessionsContainer');
const emptyState = document.getElementById('emptyState');
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded. Initializing...");

  
    if (container) {
        renderSessions();
        updateStats();
    }

    
    if (display) {
        updateDisplay();
        setupTimerListeners();
    }
});


function updateDisplay() {
    if (!display) return;
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    let displayString = "";
    if (hours > 0) { displayString += `${hours}:`; }
    displayString += `${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    display.textContent = displayString;
}

function setupTimerListeners() {
    if (startBtn) {
        startBtn.addEventListener('click', startTimer);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (timerId) { clearInterval(timerId); timerId = null; }
            timeLeft = savedCustomTime ? parseInt(savedCustomTime) : 1500;
            if (startBtn) startBtn.textContent = 'START';
            updateDisplay();
        });
    }

    
    document.querySelectorAll('.mode-btn').forEach(button => {
        button.addEventListener('click', () => {
            const activeBtn = document.querySelector('.mode-btn.active');
            if (activeBtn) activeBtn.classList.remove('active');
            
            button.classList.add('active');
            timeLeft = parseInt(button.dataset.time);
            localStorage.removeItem('customTimerSeconds'); 
            if (timerId) { clearInterval(timerId); timerId = null; }
            if (startBtn) startBtn.textContent = 'START';
            updateDisplay();
        });
    });
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

function handleSessionCompletion() {
    const originalTime = savedCustomTime ? parseInt(savedCustomTime) : 1500;
    const minutesSpent = Math.floor(originalTime / 60);
    let totalMinutes = parseInt(localStorage.getItem('totalStudyMinutes')) || 0;
    localStorage.setItem('totalStudyMinutes', totalMinutes + minutesSpent);

    let completedCount = parseInt(localStorage.getItem('completedSessions')) || 0;
    localStorage.setItem('completedSessions', completedCount + 1);

    localStorage.setItem('finished-' + activeSubject, 'true');

    const newSession = {
        id: Date.now(),
        title: activeSubject,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: "Study",
        status: "Completed",
        icon: "fa-check-circle"
    };

    sessions.unshift(newSession);
    localStorage.setItem('studySessions', JSON.stringify(sessions));
    localStorage.removeItem('customTimerSeconds');

    alert(`Great job! You finished: ${activeSubject}`);
    window.location.href = "Sessions.html"; 
}


function renderSessions() {
    if (!container || !emptyState) return; 
    
    const sessionsList = JSON.parse(localStorage.getItem('studySessions')) || [];

    if (sessionsList.length === 0) {
        emptyState.classList.remove('hidden');
        container.innerHTML = '';
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = sessionsList.map(session => `
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
    `).join('');
}

function updateStats() {
    const sessionCountEl = document.getElementById('sessionCount');
    const weeklyGoalEl = document.getElementById('weeklyGoal');
    const goalBarEl = document.getElementById('goalBar');

    const completedCount = parseInt(localStorage.getItem('completedSessions')) || 0;
    const goal = 20;
    const progressPercent = Math.min((completedCount / goal) * 100, 100);

    if (sessionCountEl) sessionCountEl.textContent = `${completedCount} Sessions`;
    if (weeklyGoalEl) weeklyGoalEl.textContent = `${completedCount}/${goal}`;
    if (goalBarEl) goalBarEl.style.width = `${progressPercent}%`;
}