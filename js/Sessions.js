
let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
const WEEKLY_GOAL = 20; 
const container = document.getElementById('sessionsContainer');
const emptyState = document.getElementById('emptyState');
const sessionCountDisplay = document.getElementById('sessionCount');
const weeklyGoalDisplay = document.getElementById('weeklyGoal');
const goalBar = document.getElementById('goalBar');
const createSessionCard = (session) => {
    return `
        <div class="session-card">
            <i class="fas ${session.icon} icon-bg"></i>
            <div style="position: relative; z-index: 2;">
                <span style="color: var(--accent); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    ${session.category}
                </span>
                <h3 style="margin: 10px 0 5px 0; font-size: 1.3rem; font-weight: 800;">${session.title}</h3>
                <p style="color: #888; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
                    <i class="bi bi-clock"></i> Finished at ${session.time}
                </p>
                
                <div style="margin-top: 25px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="background: #E8F5E9; color: #2E7D32; padding: 6px 14px; border-radius: 10px; font-size: 0.7rem; font-weight: 800;">
                        ${session.status.toUpperCase()}
                    </span>
                    <i class="bi bi-check-circle-fill" style="color: #2E7D32; font-size: 1.2rem;"></i>
                </div>
            </div>
        </div>
    `;
};
const updateStats = () => {
    const completedCount = sessions.length;
    if (sessionCountDisplay) {
        sessionCountDisplay.textContent = `${completedCount} Sessions`;
    }
    if (weeklyGoalDisplay) {
        weeklyGoalDisplay.textContent = `${completedCount}/${WEEKLY_GOAL}`;
    }
    if (goalBar) {
        const progressPercent = Math.min((completedCount / WEEKLY_GOAL) * 100, 100);
        goalBar.style.width = `${progressPercent}%`;
    }
};

const renderSessions = () => {
    if (!container) return; 
    updateStats();
    if (sessions.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    container.innerHTML = sessions.map(session => createSessionCard(session)).join('');
};
document.addEventListener('DOMContentLoaded', renderSessions);
let timeLeft = 1500; 
let timerId = null;
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
    let completedCount = localStorage.getItem('completedSessions') || 0;
    localStorage.setItem('completedSessions', parseInt(completedCount) + 1);
    let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
    const newSession = {
        id: Date.now(),
        title: "Deep Work Session",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: "Study",
        status: "Completed",
        icon: "fa-check-circle",
        theme: "green"
    };
    sessions.unshift(newSession);
    localStorage.setItem('studySessions', JSON.stringify(sessions));

    alert("Session Completed! Go check your progress.");
    window.location.href = "Sessions.html";
}
        }, 1000);
    }
}

if (startBtn && resetBtn && display) {
    startBtn.addEventListener('click', startTimer);

    resetBtn.addEventListener('click', () => {
        clearInterval(timerId);
        timerId = null;
        const activeBtn = document.querySelector('.mode-btn.active');
        if (activeBtn) {
            timeLeft = parseInt(activeBtn.dataset.time);
        }
        startBtn.textContent = 'START';
        updateDisplay();
    });

    document.querySelectorAll('.mode-btn').forEach(button => {
        button.addEventListener('click', () => {
            const active = document.querySelector('.active');
            if (active) active.classList.remove('active');
            button.classList.add('active');
            
            timeLeft = parseInt(button.dataset.time);
            clearInterval(timerId);
            timerId = null;
            startBtn.textContent = 'START';
            updateDisplay();
        });
    });
}