let sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
let savedCustomTime = localStorage.getItem('customTimerSeconds');
let activeSubject = localStorage.getItem('activeSubject') || "Deep Work Session";
let timeLeft = savedCustomTime ? parseInt(savedCustomTime) : 1500;
let timerId = null;
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
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
function handleSessionCompletion() {
    let completedCount = localStorage.getItem('completedSessions') || 0;
    localStorage.setItem('completedSessions', parseInt(completedCount) + 1);
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
    alert(`Great job! You finished your session for: ${activeSubject}`);
    window.location.href = "Sessions.html"; 
}
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