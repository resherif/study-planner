let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
const WEEKLY_GOAL = 20; 

const container = document.getElementById('sessionsContainer');
const emptyState = document.getElementById('emptyState');
const sessionCountDisplay = document.getElementById('sessionCount');
const weeklyGoalDisplay = document.getElementById('weeklyGoal');
const goalBar = document.getElementById('goalBar');

const createSessionCard = (session) => {
    const statusColor = session.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';

    return `
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i class="fas ${session.icon} text-6xl"></i>
            </div>
            <div class="relative z-10">
                <span class="text-[10px] font-bold uppercase tracking-widest text-green-500 mb-2 block">
                    ${session.category}
                </span>
                <h3 class="text-xl font-bold text-gray-800 mb-1">${session.title}</h3>
                <p class="text-gray-500 text-sm flex items-center gap-2 mb-4">
                    <i class="far fa-clock"></i> Finished at: ${session.time}
                </p>
                <div class="flex justify-between items-center mt-6">
                    <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${statusColor}">
                        ${session.status}
                    </span>
                </div>
            </div>
        </div>
    `;
};

const updateStats = () => {
    const completedCount = sessions.length;
    sessionCountDisplay.textContent = `${completedCount} Sessions`;
    weeklyGoalDisplay.textContent = `${completedCount}/${WEEKLY_GOAL}`;
    const progressPercent = Math.min((completedCount / WEEKLY_GOAL) * 100, 100);
    goalBar.style.width = `${progressPercent}%`;
};

const renderSessions = () => {
    updateStats();
    
    if (sessions.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = sessions.map(session => createSessionCard(session)).join('');
};

document.addEventListener('DOMContentLoaded', renderSessions);
let timeLeft = 1500; 
let timerId = null;
const display = document.getElementById('display');
const startBtn = document.getElementById('start');

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
document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active');
        button.classList.add('active');
        
        timeLeft = parseInt(button.dataset.time);
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'START';
        updateDisplay();
    });
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    const activeTime = document.querySelector('.mode-btn.active').dataset.time;
    timeLeft = parseInt(activeTime);
    startBtn.textContent = 'START';
    updateDisplay();
});

startBtn.addEventListener('click', startTimer);