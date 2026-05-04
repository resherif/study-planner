document.addEventListener('DOMContentLoaded', function() {
    
    let viewDate = new Date(); 

    function renderCalendar() {
        const today = new Date();
        const month = viewDate.getMonth();
        const year = viewDate.getFullYear();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        
        const monthEl = document.getElementById('display-month');
        const weeksGrid = document.getElementById('weeks-grid');

        if (!monthEl || !weeksGrid) return;

        monthEl.innerText = `${monthNames[month]} ${year}`;
        
        // Clear previous grid
        weeksGrid.innerHTML = ""; 

        // Get first day of month (0-6, Sunday-Saturday)
        const firstDayIndex = new Date(year, month, 1).getDay();
        
        // Get total days in current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let daysHtml = "";

        // 1. Add empty slots for the beginning of the month
        for (let i = 0; i < firstDayIndex; i++) {
            daysHtml += `<span class="last-month"></span>`;
        }

        // 2. Add the actual days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = (
                i === today.getDate() && 
                month === today.getMonth() && 
                year === today.getFullYear()
            ) ? 'active' : '';
            
            // Format number to 01, 02, etc.
            const dateDisplay = i < 10 ? '0' + i : i;
            daysHtml += `<span class="${isToday}">${dateDisplay}</span>`;
        }

        // 3. Inject into the grid
        weeksGrid.innerHTML = daysHtml;
    }

    // Event Listeners
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const calendarCard = document.getElementById('calendar');

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation(); 
            viewDate.setMonth(viewDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation(); 
            viewDate.setMonth(viewDate.getMonth() + 1);
            renderCalendar();
        });
    }

    // if (calendarCard) {
    //     calendarCard.addEventListener('click', function(e) {
    //         // Prevent flip if clicking nav buttons
    //         if (!['BUTTON', 'I'].includes(e.target.tagName)) {
    //             this.classList.toggle('flip');
    //         }
    //     });
    // }

    // Initial Render
    renderCalendar();
});