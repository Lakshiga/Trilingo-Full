// ~/js/admin/lessons.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Configuration & Element References ---
    const tableBody = document.getElementById('tableBody');
    const addNewBtn = document.getElementById('addNewBtn');
    const newEntryTfoot = document.getElementById('newEntryTfoot');
    const dynamicHeader = document.getElementById('dynamicHeader');
    const adminContainer = document.querySelector('.admin-container');
    const entityName = 'Lesson';

    const urlParams = new URLSearchParams(window.location.search);
    const levelId = urlParams.get('levelId');

    const getLessonsApiUrl = `/lessons/${levelId}`;
    const createLessonApiUrl = `/api/lesson/level/${levelId}/lessons`;
    const updateLessonApiUrl = (lessonId) => `/api/lesson/lessons/${lessonId}`;
    const deleteLessonApiUrl = (lessonId) => `/api/lesson/lessons/${lessonId}`;

    if (!levelId || isNaN(parseInt(levelId))) {
        adminContainer.innerHTML = `
            <h1 class="admin-header mb-0 text-danger">Error: No Level Selected</h1>
            <p class="admin-description">A valid Level ID must be provided in the URL to manage lessons.</p>
            <p>Example: <code>/Admin/Lessons?levelId=1</code></p>
            <a href="/Admin/Levels" class="btn btn-primary mt-3"><i class="fas fa-arrow-left"></i> Go Back to Levels</a>`;
        return;
    }
    fetchData();

    // --- RENDER FUNCTION (UPDATED) ---
    function renderTable(lessons) {
        // 1. UPDATED COLSPAN TO ACCOUNT FOR NEW "Activities" COLUMN
        const colspan = 6;
        tableBody.innerHTML = '';
        if (!lessons || lessons.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${colspan}" class="text-center">No lessons found for this level. You can add one!</td></tr>`;
            return;
        }

        lessons.sort((a, b) => a.sequenceOrder - b.sequenceOrder);

        lessons.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', item.lessonId);
            row.innerHTML = `
                <td>${item.lessonId}</td>
                <td data-field="lessonName">${item.lessonName}</td>
                <td data-field="description">${item.description || ''}</td>
                <td data-field="sequenceOrder">${item.sequenceOrder}</td>
                <td>
                    <a href="/Admin/ActivityList?lessonId=${item.lessonId}&levelId=${levelId}&lessonName=${encodeURIComponent(item.lessonName)}" class="btn btn-sm btn-info">
                        <i class="fas fa-tasks"></i> Manage
                    </a>
                </td>
                <td class="actions-column">
                    <button class="btn btn-sm btn-primary btn-edit">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete">Delete</button>
                    <button class="btn btn-sm btn-success btn-save" style="display:none;">Save</button>
                    <button class="btn btn-sm btn-secondary btn-cancel" style="display:none;">Cancel</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    async function fetchData() {
        try {
            const colspan = 6; // Use the updated colspan
            tableBody.innerHTML = `<tr><td colspan="${colspan}" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>`;
            const response = await fetch(getLessonsApiUrl);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            dynamicHeader.textContent = `Manage Lessons for: ${result.levelName}`;
            renderTable(result.lessons);

        } catch (error) {
            const colspan = 6; // Use the updated colspan
            console.error(`Error fetching ${entityName}s:`, error);
            dynamicHeader.textContent = 'Error Loading Lessons';
            tableBody.innerHTML = `<tr><td colspan="${colspan}" class="text-center text-danger">Could not load lessons. Check the browser console for details.</td></tr>`;
        }
    }

    // NO CHANGES ARE NEEDED IN ANY OF THE FUNCTIONS BELOW THIS LINE
    // The logic for creating, updating, and deleting lessons remains the same.

    async function createItem(payload) { /* ... same as before ... */ }
    async function updateItem(id, payload) { /* ... same as before ... */ }
    async function deleteItem(id) { /* ... same as before ... */ }
    adminContainer.addEventListener('click', async function (e) { /* ... same as before ... */ });
    function showAddNewRow() { /* ... same as before ... */ }
    function hideAddNewRow() { /* ... same as before ... */ }
    async function handleSaveNew() { /* ... same as before ... */ }
    async function handleDelete(row) { /* ... same as before ... */ }
    const fields = ['lessonName', 'description', 'sequenceOrder'];
    function enterEditMode(row) { /* ... same as before ... */ }
    async function exitEditMode(row, shouldSave) { /* ... same as before ... */ }
    function toggleButtons(row, isEditing) { /* ... same as before ... */ }

    // --- RE-ADDING THE UNCHANGED FUNCTIONS FOR COMPLETENESS ---
    async function createItem(payload) {
        try {
            const response = await fetch(createLessonApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to create lesson.' }));
                throw new Error(errorData.message);
            }
            return true;
        } catch (error) {
            console.error(`Error creating ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    async function updateItem(id, payload) {
        try {
            const response = await fetch(updateLessonApiUrl(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to save changes.');
            return true;
        } catch (error) {
            console.error(`Error updating ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    async function deleteItem(id) {
        try {
            const response = await fetch(deleteLessonApiUrl(id), {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete lesson.');
            return true;
        } catch (error) {
            console.error(`Error deleting ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    adminContainer.addEventListener('click', async function (e) {
        const target = e.target;
        if (target.id === 'addNewBtn') {
            showAddNewRow();
            return;
        }
        const row = target.closest('tr');
        if (!row) return;
        if (tableBody.contains(target)) {
            if (target.classList.contains('btn-edit')) enterEditMode(row);
            else if (target.classList.contains('btn-save')) await exitEditMode(row, true);
            else if (target.classList.contains('btn-cancel')) exitEditMode(row, false);
            else if (target.classList.contains('btn-delete')) await handleDelete(row);
        }
        else if (newEntryTfoot.contains(target)) {
            if (target.classList.contains('btn-save-new')) await handleSaveNew();
            else if (target.classList.contains('btn-cancel-new')) hideAddNewRow();
        }
    });

    function showAddNewRow() {
        newEntryTfoot.style.display = 'table-footer-group';
        addNewBtn.style.display = 'none';
        document.getElementById('newName').focus();
    }

    function hideAddNewRow() {
        newEntryTfoot.querySelectorAll('input').forEach(input => input.value = '');
        newEntryTfoot.style.display = 'none';
        addNewBtn.style.display = 'block';
    }

    async function handleSaveNew() {
        const payload = {
            lessonName: document.getElementById('newName').value.trim(),
            description: document.getElementById('newDescription').value.trim(),
            sequenceOrder: parseInt(document.getElementById('newOrder').value, 10)
        };
        if (!payload.lessonName || isNaN(payload.sequenceOrder)) {
            alert('Lesson Name and a valid Order number are required.');
            return;
        }
        const success = await createItem(payload);
        if (success) {
            hideAddNewRow();
            await fetchData();
        }
    }

    async function handleDelete(row) {
        const id = row.dataset.id;
        const name = row.querySelector('[data-field="lessonName"]').textContent;
        if (!confirm(`Are you sure you want to delete the lesson "${name}"?`)) return;
        const success = await deleteItem(id);
        if (success) {
            row.remove();
        }
    }

    function enterEditMode(row) {
        const currentlyEditing = document.querySelector('tr[data-original-data]');
        if (currentlyEditing && currentlyEditing !== row) {
            exitEditMode(currentlyEditing, false);
        }
        const originalData = {};
        fields.forEach(field => {
            const cell = row.querySelector(`[data-field="${field}"]`);
            originalData[field] = cell.textContent;
            const inputType = field === 'sequenceOrder' ? 'number' : 'text';
            cell.innerHTML = `<input type="${inputType}" class="form-control" value="${cell.textContent}">`;
        });
        row.dataset.originalData = JSON.stringify(originalData);
        row.querySelector('[data-field="lessonName"] input').focus();
        toggleButtons(row, true);
    }

    async function exitEditMode(row, shouldSave) {
        const id = row.dataset.id;
        const originalData = JSON.parse(row.dataset.originalData);
        if (shouldSave) {
            const payload = {
                lessonName: row.querySelector('[data-field="lessonName"] input').value.trim(),
                description: row.querySelector('[data-field="description"] input').value.trim(),
                sequenceOrder: parseInt(row.querySelector('[data-field="sequenceOrder"] input').value, 10)
            };
            if (!payload.lessonName || isNaN(payload.sequenceOrder)) {
                alert('Lesson Name and a valid Order number are required.');
                return;
            }
            const success = await updateItem(id, payload);
            if (!success) return;
        }
        fields.forEach(field => {
            const cell = row.querySelector(`[data-field="${field}"]`);
            const value = shouldSave ? row.querySelector(`[data-field="${field}"] input`).value : originalData[field];
            cell.textContent = value;
        });
        row.removeAttribute('data-original-data');
        toggleButtons(row, false);
    }

    function toggleButtons(row, isEditing) {
        row.querySelector('.btn-edit').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-delete').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-save').style.display = isEditing ? 'inline-block' : 'none';
        row.querySelector('.btn-cancel').style.display = isEditing ? 'inline-block' : 'none';
    }
});