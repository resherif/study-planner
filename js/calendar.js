document.addEventListener('DOMContentLoaded', function() {
    let viewDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    function renderCalendar() {
        const monthEl = document.getElementById('display-month');
        const weeksGrid = document.getElementById('weeks-grid');
        if (!monthEl || !weeksGrid) return;

        const month = viewDate.getMonth();
        const year = viewDate.getFullYear();
        const today = new Date();

        monthEl.innerText = `${monthNames[month]} ${year}`;
        
        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let daysHtml = "";
        for (let i = 0; i < firstDayIndex; i++) {
            daysHtml += `<span class="last-month"></span>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `day-${i}-${month}-${year}`;
            const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? 'active' : '';
            const hasEvent = localStorage.getItem(dateKey) ? 'has-event' : '';

            daysHtml += `<span class="${isToday} ${hasEvent}" data-key="${dateKey}" data-day="${i}">${i < 10 ? '0' + i : i}</span>`;
        }
        weeksGrid.innerHTML = daysHtml;
    }

    // --- CLICK LOGIC ---
    document.getElementById('weeks-grid').onclick = function(e) {
        const clickedSpan = e.target.closest('span');
        if (!clickedSpan || clickedSpan.classList.contains('last-month')) return;

        const dayKey = clickedSpan.getAttribute('data-key');
        const dayNum = clickedSpan.getAttribute('data-day');
        const savedTask = localStorage.getItem(dayKey);

        // Update Detail View
        const detailView = document.getElementById('day-detail-view');
        detailView.classList.remove('d-none');
        document.getElementById('detail-date-label').innerText = `${dayNum} ${monthNames[viewDate.getMonth()]}`;
        document.getElementById('detail-task-text').innerText = savedTask || "No tasks planned";
        // Store key for the Modal
        document.getElementById('saveEventBtn').setAttribute('data-current-key', dayKey);
    };

    // --- OPEN MODAL TO EDIT ---
    document.getElementById('open-modal-btn').onclick = function() {
        const dayKey = document.getElementById('saveEventBtn').getAttribute('data-current-key');
        document.getElementById('eventTitle').value = localStorage.getItem(dayKey) || "";
        bootstrap.Modal.getOrCreateInstance(document.getElementById('eventModal')).show();
    };

    // --- SAVE LOGIC ---
    document.getElementById('saveEventBtn').onclick = function() {
        const dayKey = this.getAttribute('data-current-key');
        const title = document.getElementById('eventTitle').value.trim();

        if (title) localStorage.setItem(dayKey, title);
        else localStorage.removeItem(dayKey);

        bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        renderCalendar();
        
        // Update the detail view text immediately
        document.getElementById('detail-task-text').innerText = title || "No tasks planned";
    };

    // Navigation
    // --- CLOSE DETAIL VIEW ---
document.getElementById('close-detail-btn').onclick = function() {
    const detailView = document.getElementById('day-detail-view');
    
    // Hide the detail area
    detailView.classList.add('d-none');
    
    // Also remove the "Creamy Ring" from the calendar day
    document.querySelectorAll('#weeks-grid span').forEach(s => s.classList.remove('selected-day'));
};
    document.getElementById('prevMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
    document.getElementById('nextMonth').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
});