import React from 'react';
import InlineCrudTable from '../components/common/InlineCrudTable';
import { MainActivity } from '../types/mainActivity';
import * as mainActivityApi from '../api/mainActivityApi';
import { MainActivityCreateDto } from '../api/mainActivityApi';

const MainActivityPage: React.FC = () => {
    
    const columns = [
        { field: 'name' as keyof MainActivity, headerName: 'Activity Name', type: 'string' as const }
    ];

    // This API service object now points to the refactored, apiClient-based functions
    const apiService = {
        getAll: mainActivityApi.getAll,
        create: mainActivityApi.create,
        update: mainActivityApi.update,
        delete: mainActivityApi.deleteItem
    };

    return (
        <InlineCrudTable<MainActivity, MainActivityCreateDto>
            entityName="Main Activity"
            apiService={apiService}
            columns={columns}
            idField="id"
        />
    );
};

export default MainActivityPage;