// ~/js/admin/activityTypes.js

document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('tableBody');
    const addNewBtn = document.getElementById('addNewBtn');
    const newEntryTfoot = document.getElementById('newEntryTfoot');
    const adminContainer = document.querySelector('.admin-container');

    // --- Configuration ---
    // CORRECTED: The API endpoint now matches the C# controller's route.
    const apiEndpoint = '/api/activitytype/types';
    const entityName = 'Activity Type';

    // --- RENDER FUNCTION ---
    function renderTable(items) {
        tableBody.innerHTML = '';
        if (!items || items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No ${entityName}s found.</td></tr>`;
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');
            // CORRECTED: Use 'activityTypeId' from the DTO to set the data-id attribute.
            row.setAttribute('data-id', item.activityTypeId);

            // CORRECTED: Use the property names from the C# DTO ('activityTypeId' and 'activityName').
            row.innerHTML = `
                <td>${item.activityTypeId}</td>
                <td data-field="name">${item.activityName}</td> 
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

    // --- API CALLS (Modified to use the correct endpoint structure) ---
    async function fetchData() {
        try {
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
            const response = await fetch(apiEndpoint); // GET /api/activitytype/types
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const items = await response.json();
            renderTable(items);
        } catch (error) {
            console.error(`Error fetching ${entityName}s:`, error);
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Could not load ${entityName}s.</td></tr>`;
        }
    }

    async function createItem(payload) {
        try {
            const response = await fetch(apiEndpoint, { // POST /api/activitytype/types
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ title: `Failed to create ${entityName}` }));
                throw new Error(errorData.title || `HTTP error! status: ${response.status}`);
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
            // CORRECTED: The URL for update/delete needs the ID at the end.
            const response = await fetch(`${apiEndpoint}/${id}`, { // PUT /api/activitytype/types/{id}
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ title: 'Failed to save changes' }));
                throw new Error(errorData.title || `HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error(`Error updating ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    async function deleteItem(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, { // DELETE /api/activitytype/types/{id}
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = response.status === 404 ? `${entityName} not found.` : "Failed to delete.";
                throw new Error(errorText);
            }
            return true;
        } catch (error) {
            console.error(`Error deleting ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    // --- EVENT HANDLING & LOGIC (Unchanged from your improved version, as it's already good) ---
    // This part correctly uses `row.dataset.id` which now gets the correct value.

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
        } else if (newEntryTfoot.contains(target)) {
            if (target.classList.contains('btn-save-new')) await handleSaveNew();
            else if (target.classList.contains('btn-cancel-new')) hideAddNewRow();
        }
    });

    async function handleDelete(row) {
        const id = row.dataset.id;
        const name = row.querySelector('[data-field="name"]').textContent;
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
        const success = await deleteItem(id);
        if (success) row.remove();
    }

    function showAddNewRow() {
        const currentlyEditing = tableBody.querySelector('tr[data-original-name]');
        if (currentlyEditing) exitEditMode(currentlyEditing, false);
        newEntryTfoot.style.display = 'table-footer-group';
        addNewBtn.style.display = 'none';
        document.getElementById('newName').focus();
    }

    function hideAddNewRow() {
        document.getElementById('newName').value = '';
        newEntryTfoot.style.display = 'none';
        addNewBtn.style.display = 'block';
    }

    async function handleSaveNew() {
        const nameInput = document.getElementById('newName');
        const payload = { Name: nameInput.value.trim() }; // Use 'Name' to match the backend model binding
        if (!payload.Name) {
            alert('Name cannot be empty.');
            return;
        }
        const success = await createItem(payload);
        if (success) {
            hideAddNewRow();
            await fetchData();
        }
    }

    function enterEditMode(row) {
        const currentlyEditing = tableBody.querySelector('tr[data-original-name]');
        if (currentlyEditing && currentlyEditing !== row) exitEditMode(currentlyEditing, false);
        const nameCell = row.querySelector('[data-field="name"]');
        row.setAttribute('data-original-name', nameCell.textContent);
        nameCell.innerHTML = `<input type="text" class="form-control" value="${nameCell.textContent}">`;
        nameCell.querySelector('input').focus();
        toggleButtons(row, true);
    }

    async function exitEditMode(row, shouldSave) {
        const id = row.dataset.id;
        const nameCell = row.querySelector('[data-field="name"]');
        const originalName = row.dataset.originalName;
        if (shouldSave) {
            const nameInput = nameCell.querySelector('input');
            const payload = { Name: nameInput.value.trim() }; // Use 'Name' to match backend
            if (!payload.Name) {
                alert('Name cannot be empty.');
                return;
            }
            if (payload.Name === originalName) {
                exitEditMode(row, false);
                return;
            }
            const success = await updateItem(id, payload);
            if (success) {
                nameCell.textContent = payload.Name;
            } else {
                return;
            }
        } else {
            nameCell.textContent = originalName;
        }
        row.removeAttribute('data-original-name');
        toggleButtons(row, false);
    }

    function toggleButtons(row, isEditing) {
        row.querySelector('.btn-edit').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-delete').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-save').style.display = isEditing ? 'inline-block' : 'none';
        row.querySelector('.btn-cancel').style.display = isEditing ? 'inline-block' : 'none';
    }

    fetchData();
});