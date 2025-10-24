document.addEventListener('DOMContentLoaded', function () {
    // --- ELEMENT REFERENCES ---
    const tableBody = document.getElementById('tableBody');
    const dynamicHeader = document.getElementById('dynamicHeader');
    const backButtonContainer = document.getElementById('backButtonContainer');
    const addNewActivityBtn = document.getElementById('addNewActivityBtn');

    // --- INITIAL DATA (CORRECTED ORDER) ---
    // 1. Define urlParams FIRST.
    const urlParams = new URLSearchParams(window.location.search);

    // 2. Now you can safely use urlParams to get the values.
    const lessonId = urlParams.get('lessonId');
    const lessonName = urlParams.get('lessonName');
    const levelId = urlParams.get('levelId');

    // 3. Consolidated error checking.
    if (!lessonId || !levelId) {
        document.querySelector('.admin-container').innerHTML = `
            <h1 class="text-danger">Error: Missing Required Information</h1>
            <p>A valid Lesson ID and Level ID must be provided in the URL.</p>
            <a href="/Admin/Levels" class="btn btn-primary">Return to Levels</a>`;
        return;
    }

    // --- SET DYNAMIC CONTENT ---
    dynamicHeader.textContent = `Activities for: ${decodeURIComponent(lessonName || 'Lesson')}`;
    // Pass both IDs forward to the editor for its back button
    addNewActivityBtn.href = `/Admin/ActivityEditor?lessonId=${lessonId}&levelId=${levelId}&lessonName=${encodeURIComponent(lessonName || '')}`;
    // Use the captured levelId to build the correct back link
    backButtonContainer.innerHTML = `<a href="/Admin/Lessons?levelId=${levelId}" class="btn btn-secondary"><i class="fas fa-arrow-left"></i> Back to Lessons</a>`;

    // --- FETCH AND RENDER LOGIC (No changes needed here, it's correct) ---
    async function fetchData() {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading...</td></tr>';
        try {
            const response = await fetch(`/api/activities/by-lesson?lessonId=${lessonId}`);
            if (!response.ok) throw new Error('Failed to fetch data');

            const activities = await response.json();

            if (activities.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No activities found for this lesson.</td></tr>';
                return;
            }

            tableBody.innerHTML = ''; // Clear loading spinner
            activities.sort((a, b) => a.sequenceOrder - b.sequenceOrder).forEach(activity => {
                const row = document.createElement('tr');
                // Pass the levelId along to the editor as well
                const editorUrl = `/Admin/ActivityEditor?lessonId=${lessonId}&levelId=${levelId}&activityId=${activity.activityId}&lessonName=${encodeURIComponent(lessonName || '')}`;
                row.innerHTML = `
                    <td>${activity.activityId}</td>
                    <td>${activity.title}</td>
                    <td>${activity.sequenceOrder}</td>
                    <td>${activity.activityTypeName || 'N/A'}</td>
                    <td>${activity.mainActivityName || 'N/A'}</td>
                    <td class="actions-column">
                        <a href="${editorUrl}" class="btn btn-sm btn-primary">
                            <i class="fas fa-edit"></i> Manage
                        </a>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Failed to fetch activities:', error);
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load activities.</td></tr>';
        }
    }

    fetchData();
});