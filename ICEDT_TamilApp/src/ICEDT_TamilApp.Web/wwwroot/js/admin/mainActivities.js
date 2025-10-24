// ~/js/admin/mainActivities.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Configuration ---
    const tableBody = document.getElementById('tableBody');
    const addNewBtn = document.getElementById('addNewBtn');
    const newEntryTfoot = document.getElementById('newEntryTfoot');
    const apiEndpoint = '/api/mainactivities';
    const entityName = 'Main Activity';

    // --- RENDER FUNCTION ---
    // Renders the table rows from the data fetched from the API
    function renderTable(items) {
        tableBody.innerHTML = ''; // Clear existing rows
        if (!items || items.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No ${entityName}s found.</td></tr>`;
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', item.id);
            row.innerHTML = `
                <td>${item.id}</td>
                <td data-field="name">${item.name}</td>
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

    // --- API CALLS ---
    // Fetches all items from the API
    async function fetchData() {
        try {
            tableBody.innerHTML = '<tr><td colspan="3" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const items = await response.json();
            renderTable(items);
        } catch (error) {
            console.error(`Error fetching ${entityName}s:`, error);
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Could not load ${entityName}s.</td></tr>`;
        }
    }

    // Creates a new item via a POST request
    async function createItem(payload) {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Try to parse error details from the response body for better feedback
                const errorData = await response.json().catch(() => ({ title: `Failed to create ${entityName}` }));
                throw new Error(errorData.title || `HTTP error! status: ${response.status}`);
            }
            return true; // Success
        } catch (error) {
            console.error(`Error creating ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    // Updates an item via a PUT request
    async function updateItem(id, payload) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ title: 'Failed to save changes' }));
                throw new Error(errorData.title || `HTTP error! status: ${response.status}`);
            }
            return true; // Success
        } catch (error) {
            console.error(`Error updating ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    // Deletes an item via a DELETE request
    async function deleteItem(id) {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = response.status === 404 ? `${entityName} not found.` : `Failed to delete. Status: ${response.status}`;
                throw new Error(errorText);
            }
            return true; // Success
        } catch (error) {
            console.error(`Error deleting ${entityName}:`, error);
            alert(`Error: ${error.message}`);
            return false;
        }
    }

    // --- EVENT HANDLING ---
    // Uses event delegation for all button clicks for efficiency
    document.querySelector('.admin-container').addEventListener('click', async function (e) {
        const target = e.target;

        // Handle global "Add New" button
        if (target.id === 'addNewBtn') {
            showAddNewRow();
            return;
        }

        const row = target.closest('tr');
        if (!row) return; // Exit if the click was not inside a table row

        // Handle buttons within the main table body
        if (tableBody.contains(target)) {
            if (target.classList.contains('btn-edit')) {
                enterEditMode(row);
            } else if (target.classList.contains('btn-save')) {
                await exitEditMode(row, true);
            } else if (target.classList.contains('btn-cancel')) {
                exitEditMode(row, false);
            } else if (target.classList.contains('btn-delete')) {
                await handleDelete(row);
            }
        }
        // Handle buttons within the tfoot for new entry
        else if (newEntryTfoot.contains(target)) {
            if (target.classList.contains('btn-save-new')) {
                await handleSaveNew();
            } else if (target.classList.contains('btn-cancel-new')) {
                hideAddNewRow();
            }
        }
    });

    // --- DELETE LOGIC ---
    async function handleDelete(row) {
        const id = row.dataset.id;
        const name = row.querySelector('[data-field="name"]').textContent;

        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }
        const success = await deleteItem(id);
        if (success) {
            row.remove();
            // Optional: Add a success alert
            // alert(`${entityName} deleted successfully!`);
        }
    }

    // --- ADD NEW LOGIC ---
    function showAddNewRow() {
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
        const newNameInput = document.getElementById('newName');
        const payload = {
            name: newNameInput.value.trim(),
        };

        if (!payload.name) {
            alert('Name cannot be empty.');
            return;
        }

        const success = await createItem(payload);
        if (success) {
            hideAddNewRow();
            await fetchData(); // Refresh the entire table to get the new item with its ID
        }
    }

    // --- EDIT MODE LOGIC ---
    function enterEditMode(row) {
        // If another row is already in edit mode, cancel it first
        const currentlyEditing = document.querySelector('tr[data-original-name]');
        if (currentlyEditing && currentlyEditing !== row) {
            exitEditMode(currentlyEditing, false);
        }

        const nameCell = row.querySelector('[data-field="name"]');
        row.setAttribute('data-original-name', nameCell.textContent);
        nameCell.innerHTML = `<input type="text" class="form-control" value="${nameCell.textContent}">`;
        nameCell.querySelector('input').focus();
        toggleButtons(row, true);
    }

    async function exitEditMode(row, shouldSave) {
        const id = row.dataset.id;
        const nameCell = row.querySelector('[data-field="name"]');

        if (shouldSave) {
            const nameInput = nameCell.querySelector('input');
            const payload = {
                name: nameInput.value.trim(),
            };

            if (!payload.name) {
                alert('Name cannot be empty.');
                return; // Don't exit edit mode if validation fails
            }

            // Prevent saving if the name hasn't changed
            if (payload.name === row.dataset.originalName) {
                exitEditMode(row, false); // Just cancel without an API call
                return;
            }

            const success = await updateItem(id, payload);
            if (success) {
                nameCell.textContent = payload.name;
                row.removeAttribute('data-original-name');
                toggleButtons(row, false);
            }
        } else { // Cancel
            nameCell.textContent = row.dataset.originalName;
            row.removeAttribute('data-original-name');
            toggleButtons(row, false);
        }
    }

    function toggleButtons(row, isEditing) {
        row.querySelector('.btn-edit').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-delete').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-save').style.display = isEditing ? 'inline-block' : 'none';
        row.querySelector('.btn-cancel').style.display = isEditing ? 'inline-block' : 'none';
    }

    // --- INITIALIZATION ---
    fetchData();
});