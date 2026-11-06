// HTML-এর বাটন এবং ইনপুট বক্সগুলোকে কানেক্ট করা
const taskTitleInput = document.getElementById('taskTitle');
const taskDateInput = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// রুটিনের উপাদানগুলো কানেক্ট করা
const classDaySelect = document.getElementById('classDay');
const classSubjectInput = document.getElementById('classSubject');
const classTimeInput = document.getElementById('classTime');
const classRoomInput = document.getElementById('classRoom');
const addClassBtn = document.getElementById('addClassBtn');
const routineDisplayArea = document.getElementById('routineDisplayArea');

// সেকশন এবং নেভিগেশন কানেক্ট করা
const navDashboard = document.getElementById('navDashboard');
const navRoutine = document.getElementById('navRoutine');
const dashboardSection = document.getElementById('dashboardSection');
const routineSection = document.getElementById('routineSection');

// মেনু পরিবর্তন (Tab Switching) লজিক
navDashboard.addEventListener('click', () => {
    navDashboard.classList.add('active');
    navRoutine.classList.remove('active');
    dashboardSection.classList.remove('hidden');
    routineSection.classList.add('hidden');
});

navRoutine.addEventListener('click', () => {
    navRoutine.classList.add('active');
    navDashboard.classList.remove('active');
    routineSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    displayRoutine(); // রুটিন রিফ্রেশ করা
});

// অ্যাপ চালু হওয়ার সাথে সাথে লোড করা
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    displayRoutine();
});

// =================== টাস্ক ট্র্যাকার লজিক ===================
addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const date = taskDateInput.value;
    if (title === '' || date === '') { alert('টাস্কের নাম এবং ডেডলাইন দিন!'); return; }
    const task = { id: Date.now(), title: title, date: date };
    addTaskToDOM(task);
    saveTaskToLocal(task);
    taskTitleInput.value = ''; taskDateInput.value = '';
});

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);
    li.innerHTML = `<div><span>${task.title}</span><small>⏰ ডেডলাইন: ${task.date}</small></div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Done</button>`;
    taskList.appendChild(li);
}

function saveTaskToLocal(task) {
    let tasks = getTasksFromLocal(); tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocal() {
    let tasks = localStorage.getItem('tasks'); return tasks ? JSON.parse(tasks) : [];
}

function loadTasks() {
    taskList.innerHTML = '';
    let tasks = getTasksFromLocal(); tasks.forEach(task => addTaskToDOM(task));
}

window.deleteTask = function(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    if (taskItem) taskItem.remove();
    let tasks = getTasksFromLocal().filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// =================== ক্লাস রুটিন লজিক ===================
addClassBtn.addEventListener('click', () => {
    const day = classDaySelect.value;
    const subject = classSubjectInput.value.trim();
    const time = classTimeInput.value;
    const room = classRoomInput.value.trim();

    if (subject === '' || time === '' || room === '') { alert('সবগুলো ঘর পূরণ করুন!'); return; }

    const newClass = { id: Date.now(), day, subject, time, room };
    let routine = getRoutineFromLocal();
    routine.push(newClass);
    localStorage.setItem('routine', JSON.stringify(routine));

    classSubjectInput.value = ''; classTimeInput.value = ''; classRoomInput.value = '';
    displayRoutine();
});

function getRoutineFromLocal() {
    let routine = localStorage.getItem('routine'); return routine ? JSON.parse(routine) : [];
}

function displayRoutine() {
    routineDisplayArea.innerHTML = '';
    const routine = getRoutineFromLocal();
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার']; // শনিবার বাদ দেওয়া হয়েছে

    days.forEach(day => {
        const dayClasses = routine.filter(c => c.day === day);
        if (dayClasses.length > 0) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-section';
            dayDiv.innerHTML = `<div class="day-title">${day}</div>`;

            dayClasses.forEach(c => {
                const classDiv = document.createElement('div');
                classDiv.className = 'class-item';
                classDiv.innerHTML = `
                    <div><strong>${c.subject}</strong> - ⏰ ${c.time} | 🚪 রুম: ${c.room}</div>
                    <button class="delete-btn" onclick="deleteClass(${c.id})">Delete</button>
                `;
                dayDiv.appendChild(classDiv);
            });
            routineDisplayArea.appendChild(dayDiv);
        }
    });
}

window.deleteClass = function(id) {
    let routine = getRoutineFromLocal().filter(c => c.id !== id);
    localStorage.setItem('routine', JSON.stringify(routine));
    displayRoutine();
};
