import React from 'react';
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import { Activity } from '../../types/activity';
import { MainActivity } from '../../types/mainActivity';
import { ActivityType } from '../../types/activityType';

// --- UPDATE THE PROPS INTERFACE ---
// onSave is no longer needed
interface ActivityFormProps {
    activityData: Partial<Activity>;
    mainActivities: MainActivity[];
    activityTypes: ActivityType[];
    onDataChange: (updatedData: Partial<Activity>) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
    activityData, mainActivities, activityTypes, onDataChange
}) => {
    
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<number>) => {
        onDataChange({ ...activityData, [e.target.name]: e.target.value });
    };

    // The <form> and handleSubmit logic is removed. This component is now just a container for inputs.
    return (
        <Grid container spacing={3}>
            <Grid size={{xs:12}}>
                <Typography variant="h6" gutterBottom>Activity Details</Typography>
            </Grid>
            <Grid size={{xs:12}}>
                <TextField fullWidth label="Activity Title" name="title" value={activityData.title || ''} onChange={handleFieldChange} />
            </Grid>
            <Grid size={{xs:12}}>
                <TextField fullWidth type="number" label="Sequence Order" name="sequenceOrder" value={activityData.sequenceOrder || ''} onChange={handleFieldChange} required InputLabelProps={{ shrink: true }}/>
            </Grid>
            <Grid size={{xs:12}}>
                <FormControl fullWidth>
                    <InputLabel>Main Activity Category</InputLabel>
                    <Select name="mainActivityId" value={activityData.mainActivityId || ''} onChange={handleFieldChange} label="Main Activity Category" required>
                        {mainActivities.map(ma => <MenuItem key={ma.id} value={ma.id}>{ma.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{xs:12}}>
                <FormControl fullWidth>
                    <InputLabel>Activity Type</InputLabel>
                    <Select name="activityTypeId" value={activityData.activityTypeId || ''} onChange={handleFieldChange} label="Activity Type" required>
                        {activityTypes.map(at => <MenuItem key={at.activityTypeId} value={at.activityTypeId}>{at.activityName}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            {/* The "Save" button that was here is now GONE. */}
        </Grid>
    );
};

export default ActivityForm;