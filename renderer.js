// HTML-এর বাটন এবং ইনপুট বক্সগুলোকে জাভাস্ক্রিপ্টে কানেক্ট করা
const taskTitleInput = document.getElementById('taskTitle');
const taskDateInput = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// অ্যাপ চালু হওয়ার সাথে সাথে আগে থেকে সেভ থাকা টাস্কগুলো লোড করা
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task বাটনে ক্লিক করলে যা হবে
addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const date = taskDateInput.value;

    if (title === '' || date === '') {
        alert('দয়া করে টাস্কের নাম এবং ডেডলাইন দুটিই সিলেক্ট করুন!');
        return;
    }

    // একটি নতুন টাস্ক অবজেক্ট তৈরি করা
    const task = {
        id: Date.now(),
        title: title,
        date: date
    };

    // টাস্কটি স্ক্রিনে দেখানো এবং লোকাল মেমোরিতে সেভ করা
    addTaskToDOM(task);
    saveTaskToLocal(task);

    // ইনপুট বক্সগুলো খালি করে দেওয়া
    taskTitleInput.value = '';
    taskDateInput.value = '';
});

// টাস্কটিকে স্ক্রিনের লিস্টে যোগ করার ফাংশন
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
        <div>
            <span>${task.title}</span>
            <small>⏰ ডেডলাইন: ${task.date}</small>
        </div>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Done</button>
    `;

    taskList.appendChild(li);
}

// লোকাল স্টোরেজে (মেমোরি) টাস্ক সেভ করার ফাংশন
function saveTaskToLocal(task) {
    let tasks = getTasksFromLocal();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// লোকাল মেমোরি থেকে সব টাস্ক তুলে আনার ফাংশন
function getTasksFromLocal() {
    let tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// অ্যাপ ওপেন হলে মেমোরি থেকে ডাটা এনে স্ক্রিনে দেখানোর ফাংশন
function loadTasks() {
    let tasks = getTasksFromLocal();
    tasks.forEach(task => addTaskToDOM(task));
}

// কোনো টাস্ক শেষ হলে (Done বাটন চাপলে) তা মুছে ফেলার ফাংশн
window.deleteTask = function(id) {
    // স্ক্রিন থেকে মোছা
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    if (taskItem) taskItem.remove();

    // মেমোরি থেকে মোছা
    let tasks = getTasksFromLocal();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
