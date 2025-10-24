document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENT REFERENCES ---
    const editorHeader = document.getElementById('editorHeader');
    const activityIdInput = document.getElementById('activityId');
    const titleInput = document.getElementById('title');
    const sequenceOrderInput = document.getElementById('sequenceOrder');
    const activityTypeSelect = document.getElementById('activityType');
    const mainActivitySelect = document.getElementById('mainActivity');
    const saveBtn = document.getElementById('saveBtn');
    const backToListBtn = document.getElementById('backToListBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const jsonErrorDiv = document.getElementById('jsonError');

    // --- JSON EDITOR SETUP ---
    const jsonEditor = CodeMirror.fromTextArea(document.getElementById('contentJson'), {
        lineNumbers: true,
        mode: { name: "javascript", json: true },
        theme: "material-darker",
        autoCloseBrackets: true,
        matchBrackets: true
    });

    // --- INITIAL DATA & URL PARAMS ---
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('lessonId');
    const activityId = urlParams.get('activityId');
    const levelId = urlParams.get('levelId');
    const lessonName = urlParams.get('lessonName');
    const isNew = activityId === null;

    // --- API ENDPOINTS ---
    const activityApiUrl = isNew ? '/api/activities' : `/api/activities/${activityId}`;
    const activityTypesApiUrl = '/api/activitytypes';
    const mainActivitiesApiUrl = '/api/mainactivities';

    // --- NAVIGATION SETUP ---
    const backUrl = `/Admin/ActivityList?lessonId=${lessonId}&levelId=${levelId}&lessonName=${encodeURIComponent(lessonName || '')}`;
    backToListBtn.href = backUrl;


    // --- DATA LOADING FUNCTIONS ---
    async function loadDropdowns() {
        try {
            const [typesRes, mainTypesRes] = await Promise.all([
                fetch(activityTypesApiUrl),
                fetch(mainActivitiesApiUrl)
            ]);

            const activityTypes = await typesRes.json();
            const mainActivities = await mainTypesRes.json();

            activityTypeSelect.innerHTML = '<option value="">-- Select Type --</option>';
            activityTypes.forEach(type => {
                activityTypeSelect.innerHTML += `<option value="${type.activityTypeId}">${type.activityName}</option>`;
            });

            mainActivitySelect.innerHTML = '<option value="">-- Select Main Type --</option>';
            mainActivities.forEach(type => {
                mainActivitySelect.innerHTML += `<option value="${type.id}">${type.name}</option>`;
            });

        } catch (error) {
            console.error("Failed to load dropdowns:", error);
            alert("Error: Could not load data for the dropdown lists. Please check the console.");
        }
    }

    async function loadActivityData() {
        if (isNew) {
            editorHeader.textContent = 'Add New Activity';
            jsonEditor.setValue('{\n  "key": "value"\n}');
            return;
        }

        editorHeader.textContent = `Edit Activity #${activityId}`;
        deleteBtn.style.display = 'inline-block';

        try {
            const response = await fetch(activityApiUrl);
            if (!response.ok) throw new Error('Activity not found.');

            const activity = await response.json();

            activityIdInput.value = activity.activityId;
            titleInput.value = activity.title;
            sequenceOrderInput.value = activity.sequenceOrder;
            activityTypeSelect.value = activity.activityTypeId;
            mainActivitySelect.value = activity.mainActivityId;

            jsonEditor.setValue(JSON.stringify(JSON.parse(activity.contentJson || '{}'), null, 2));

        } catch (error) {
            console.error("Failed to load activity:", error);
            alert("Error: Could not load the activity data.");
            editorHeader.textContent = 'Error loading activity';
        }
    }

    // --- SAVE/DELETE LOGIC ---
    async function saveActivity() {
        let contentJsonValue = "{}";
        try {
            contentJsonValue = jsonEditor.getValue();
            jsonErrorDiv.textContent = '';
        } catch (e) {
            jsonErrorDiv.textContent = `Invalid JSON format: ${e.message}`;
            return; // Stop the save operation
        }

        const payload = {
            lessonId: parseInt(lessonId, 10),
            title: titleInput.value.trim(),
            sequenceOrder: parseInt(sequenceOrderInput.value, 10),
            activityTypeId: parseInt(activityTypeSelect.value, 10),
            mainActivityId: parseInt(mainActivitySelect.value, 10),
            contentJson: contentJsonValue
        };

        if (!payload.title || !payload.lessonId || isNaN(payload.sequenceOrder) || isNaN(payload.activityTypeId) || isNaN(payload.mainActivityId)) {
            alert("Please fill out all required details (Title, Order, and both Types).");
            return;
        }

        try {
            const method = isNew ? 'POST' : 'PUT';
            const response = await fetch(activityApiUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ title: 'Failed to save activity. The server returned an error.' }));
                throw new Error(errorData.title || errorData.message);
            }

            alert('Activity saved successfully!');
            window.location.href = backToListBtn.href; // Redirect back to the list on success

        } catch (error) {
            console.error("Save failed:", error);
            alert(`Error: ${error.message}`);
        }
    }

    async function deleteActivity() {
        if (!confirm(`Are you sure you want to delete Activity #${activityId}? This cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(activityApiUrl, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete the activity.');

            alert('Activity deleted successfully!');
            window.location.href = backToListBtn.href;

        } catch (error) {
            console.error("Delete failed:", error);
            alert(`Error: ${error.message}`);
        }
    }

    // --- INITIALIZATION ---
    async function initializePage() {
        await loadDropdowns();
        await loadActivityData();
    }

    saveBtn.addEventListener('click', saveActivity);
    deleteBtn.addEventListener('click', deleteActivity);

    initializePage();
});
