import React from 'react';
import InlineCrudTable from '../components/common/InlineCrudTable';
import { ActivityType } from '../types/activityType';
import * as activityTypeApi from '../api/activityTypeApi';
import { ActivityTypeCreateDto } from '../api/activityTypeApi';

const ActivityTypesPage: React.FC = () => {
    
    const columns = [
        { field: 'activityName' as keyof ActivityType, headerName: 'Activity Type Name', type: 'string' as const }
    ];

    // This API service object now correctly points to the apiClient-based functions
    const apiService = {
        getAll: activityTypeApi.getAll,
        create: activityTypeApi.create,
        update: activityTypeApi.update,
        delete: activityTypeApi.deleteItem
    };

    return (
        <InlineCrudTable<ActivityType, ActivityTypeCreateDto>
            entityName="Activity Type"
            apiService={apiService}
            columns={columns}
            idField="activityTypeId"
        />
    );
};

export default ActivityTypesPage;