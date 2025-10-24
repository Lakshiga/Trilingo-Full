// Final Corrected ~/js/admin/levels.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Element Selectors ---
    const tableBody = document.getElementById('levelsTableBody');
    const addNewLevelBtn = document.getElementById('addNewLevelBtn');
    const newLevelTfoot = document.getElementById('newLevelTfoot');
    const adminContainer = document.querySelector('.admin-container') || document.body;

    // --- Configuration ---
    const apiEndpoint = '/api/levels';
    const entityName = 'Level';

    // --- RENDER FUNCTION (Corrected) ---
    function renderTable(levels) {
        tableBody.innerHTML = '';
        if (!levels || levels.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No levels found.</td></tr>';
            return;
        }

        levels.forEach(level => {
            const row = document.createElement('tr');
            // CORRECTED: Use 'level.levelId' from the API response
            row.setAttribute('data-level-id', level.levelId);
            row.innerHTML = `
            <td>${level.levelId}</td>
            <td data-field="levelName">${level.levelName}</td> <!-- CORRECTED: Use levelName for data and consistency -->
            <td data-field="sequenceOrder">${level.sequenceOrder}</td>
            
            <td>
                <!-- CORRECTED: Use 'level.levelId' for the link -->
                <a href="/Admin/Lessons?levelId=${level.levelId}" class="btn btn-sm btn-info">Manage Lessons</a>
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

    // --- EDIT MODE LOGIC (Corrected) ---
    function enterEditMode(row) {
        const currentlyEditing = tableBody.querySelector('tr[data-original-name]');
        if (currentlyEditing && currentlyEditing !== row) {
            exitEditMode(currentlyEditing, false);
        }

        // CORRECTED: The selector now matches the data-field set in renderTable
        const nameCell = row.querySelector('[data-field="levelName"]');
        const orderCell = row.querySelector('[data-field="sequenceOrder"]');

        if (!nameCell || !orderCell) {
            console.error("Could not find cells to edit. Check 'data-field' attributes.");
            return;
        }

        row.setAttribute('data-original-name', nameCell.textContent);
        row.setAttribute('data-original-order', orderCell.textContent);

        nameCell.innerHTML = `<input type="text" class="form-control" value="${nameCell.textContent}">`;
        orderCell.innerHTML = `<input type="number" class="form-control" value="${orderCell.textContent}">`;

        nameCell.querySelector('input').focus();
        toggleButtons(row, true);
    }

    // --- All other functions were already mostly correct and will now work with the fixes above ---

    // --- API CALLS ---
    async function fetchLevels() {
        try {
            // Updated colspan to 5 to match the new table structure
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>';
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
            const levels = await response.json();
            renderTable(levels);
        } catch (error) {
            console.error(`Error fetching ${entityName}s:`, error);
            // Updated colspan to 5
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Could not load ${entityName}s. Check the console for details.</td></tr>`;
        }
    }

    async function createLevel(payload) {
        try {
            const response = await fetch(apiEndpoint, {
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

    async function updateLevel(levelId, payload) {
        try {
            const response = await fetch(`${apiEndpoint}/${levelId}`, {
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

    async function deleteLevel(levelId) {
        try {
            const response = await fetch(`${apiEndpoint}/${levelId}`, {
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

    // --- EVENT HANDLING ---
    adminContainer.addEventListener('click', async function (e) {
        const target = e.target;
        if (target.id === 'addNewLevelBtn') {
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
        } else if (newLevelTfoot.contains(target)) {
            if (target.classList.contains('btn-save-new')) await handleSaveNew();
            else if (target.classList.contains('btn-cancel-new')) hideAddNewRow();
        }
    });

    // --- LOGIC FUNCTIONS (Corrected) ---
    async function handleDelete(row) {
        const levelId = row.dataset.levelId;
        // CORRECTED: Selector now finds the correct cell
        const levelName = row.querySelector('[data-field="levelName"]').textContent;
        if (!confirm(`Are you sure you want to delete "${levelName}"? This action cannot be undone.`)) return;
        const success = await deleteLevel(levelId);
        if (success) row.remove();
    }

    function showAddNewRow() {
        const currentlyEditing = tableBody.querySelector('tr[data-original-name]');
        if (currentlyEditing) exitEditMode(currentlyEditing, false);
        newLevelTfoot.style.display = 'table-footer-group';
        addNewLevelBtn.style.display = 'none';
        document.getElementById('newLevelName').focus();
    }

    function hideAddNewRow() {
        document.getElementById('newLevelName').value = '';
        document.getElementById('newLevelOrder').value = '';
        newLevelTfoot.style.display = 'none';
        addNewLevelBtn.style.display = 'block';
    }

    async function handleSaveNew() {
        const newNameInput = document.getElementById('newLevelName');
        const newOrderInput = document.getElementById('newLevelOrder');
        const payload = {
            levelName: newNameInput.value.trim(),
            sequenceOrder: parseInt(newOrderInput.value, 10)
        };
        if (!payload.levelName || isNaN(payload.sequenceOrder)) {
            alert('Level Name cannot be empty and Sequence Order must be a number.');
            return;
        }
        const success = await createLevel(payload);
        if (success) {
            hideAddNewRow();
            await fetchLevels();
        }
    }

    async function exitEditMode(row, shouldSave) {
        const levelId = row.dataset.levelId;
        // CORRECTED: Selectors now find the correct cells
        const nameCell = row.querySelector('[data-field="levelName"]');
        const orderCell = row.querySelector('[data-field="sequenceOrder"]');

        if (shouldSave) {
            const nameInput = nameCell.querySelector('input');
            const orderInput = orderCell.querySelector('input');
            const payload = {
                levelName: nameInput.value.trim(),
                sequenceOrder: parseInt(orderInput.value, 10)
            };
            if (!payload.levelName || isNaN(payload.sequenceOrder)) {
                alert('Level Name cannot be empty and Sequence Order must be a number.');
                return;
            }
            if (payload.levelName === row.dataset.originalName && payload.sequenceOrder === parseInt(row.dataset.originalOrder, 10)) {
                exitEditMode(row, false);
                return;
            }
            const success = await updateLevel(levelId, payload);
            if (success) {
                nameCell.textContent = payload.levelName;
                orderCell.textContent = payload.sequenceOrder;
            } else { return; }
        } else {
            nameCell.textContent = row.dataset.originalName;
            orderCell.textContent = row.dataset.originalOrder;
        }
        row.removeAttribute('data-original-name');
        row.removeAttribute('data-original-order');
        toggleButtons(row, false);
    }

    function toggleButtons(row, isEditing) {
        row.querySelector('.btn-edit').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-delete').style.display = isEditing ? 'none' : 'inline-block';
        row.querySelector('.btn-save').style.display = isEditing ? 'inline-block' : 'none';
        row.querySelector('.btn-cancel').style.display = isEditing ? 'inline-block' : 'none';
    }

    // --- INITIALIZATION ---
    fetchLevels();
});