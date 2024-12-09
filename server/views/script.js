// DOM Elements
const taskList = document.getElementById('taskList');
const addTaskForm = document.getElementById('addTaskForm');

// Fetch and display all tasks from the server
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();

    // Clear task list before adding items
    taskList.innerHTML = '';

    tasks.forEach(task => {
      taskList.innerHTML += `
        <li class="collection-item">
          <strong>${task.title}</strong>: ${task.description} (${task.status})
          <button class="btn-small red right" onclick="deleteTask('${task._id}')">Delete</button>
        </li>
      `;
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// Add a new task by submitting the form
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from reloading the page
  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();

  if (!title || !description) {
    alert('Please fill in both fields.');
    return;
  }

  try {
    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    // Clear the form and reload the task list
    addTaskForm.reset();
    fetchTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
});

// Delete a task
async function deleteTask(id) {
  try {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
    });
    fetchTasks(); // Reload the task list
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// Initial fetch of tasks
fetchTasks();

