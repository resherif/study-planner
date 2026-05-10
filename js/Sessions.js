// 1. البيانات التجريبية (يمكنك لاحقاً ربطها بـ LocalStorage أو Supabase)
let sessions = [
    {
        id: 1,
        title: "Database Indexing",
        time: "10:00 AM - 11:30 AM",
        category: "Software Engineering",
        status: "Completed",
        icon: "fa-database",
        theme: "blue"
    },
    {
        id: 2,
        title: "UI/UX Case Study",
        time: "01:00 PM - 02:30 PM",
        category: "Design",
        status: "Pending",
        icon: "fa-pen-nib",
        theme: "purple"
    },
    {
        id: 3,
        title: "React Testing Library",
        time: "04:00 PM - 05:00 PM",
        category: "Frontend",
        status: "In Progress",
        icon: "fa-vial",
        theme: "orange"
    }
];

const container = document.getElementById('sessionsContainer');
const emptyState = document.getElementById('emptyState');
const addBtn = document.getElementById('addSessionBtn');

// 2. دالة لإنشاء الـ Template الخاص بالبطاقة
const createSessionCard = (session) => {
    const statusColor = session.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                       session.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';

    return `
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i class="fas ${session.icon} text-6xl"></i>
            </div>
            
            <div class="relative z-10">
                <span class="text-[10px] font-bold uppercase tracking-widest text-${session.theme}-500 mb-2 block">
                    ${session.category}
                </span>
                <h3 class="text-xl font-bold text-gray-800 mb-1">${session.title}</h3>
                <p class="text-gray-500 text-sm flex items-center gap-2 mb-4">
                    <i class="far fa-clock"></i> ${session.time}
                </p>
                
                <div class="flex justify-between items-center mt-6">
                    <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${statusColor}">
                        ${session.status}
                    </span>
                    <button onclick="console.log('Edit clicked for ID: ${session.id}')" class="text-gray-300 hover:text-blue-600 transition-colors">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
};

// 3. دالة لرسم كل الجلسات في الصفحة
const renderSessions = () => {
    if (sessions.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = sessions.map(session => createSessionCard(session)).join('');
};

// 4. معالج الحدث لإضافة جلسة جديدة (تجريبياً)
addBtn.addEventListener('click', () => {
    const newSession = {
        id: Date.now(),
        title: "New Subject Study",
        time: "TBD",
        category: "General",
        status: "Pending",
        icon: "fa-book-open",
        theme: "green"
    };
    
    sessions = [newSession, ...sessions]; // إضافة في بداية المصفوفة
    renderSessions();
});

// تشغيل الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', renderSessions);