import React, { useState } from 'react';
import { Box, Paper, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import StayCurrentPortraitIcon from '@mui/icons-material/StayCurrentPortrait';
import StayCurrentLandscapeIcon from '@mui/icons-material/StayCurrentLandscape';

import { Activity } from '../../types/activity';
import ActivityRenderer from './ActivityRenderer';



interface DevicePreviewProps {
    activityData: Partial<Activity>;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ activityData }) => {
    const [device, setDevice] = useState<'phone' | 'tablet'>('phone');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

    // --- NEW: Calculate styles based on state ---
    const deviceDimensions = {
        phone: { width: 375, height: 667 },
        tablet: { width: 540, height: 720 }
    };

    const currentDimensions = deviceDimensions[device];
    const isLandscape = orientation === 'landscape';

    const frameStyle = {
        width: `${isLandscape ? currentDimensions.height : currentDimensions.width}px`,
        height: `${isLandscape ? currentDimensions.width : currentDimensions.height}px`,
        // ... other frame styles (border, borderRadius, etc.)
        transition: 'width 0.4s ease, height 0.4s ease',
    };
    
    let content: any;
    if (activityData.contentJson) {
        try {
            content = JSON.parse(activityData.contentJson);
        } catch (e) {
            content = { error: 'Invalid JSON' };
        }
    }

    return (
        <Box>
            <Box display="flex" justifyContent="center" mb={2} gap={2}>
                <ToggleButtonGroup value={device} exclusive onChange={(e, v) => v && setDevice(v)}>
                    <ToggleButton value="phone"><PhoneIphoneIcon /></ToggleButton>
                    <ToggleButton value="tablet"><TabletMacIcon /></ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup value={orientation} exclusive onChange={(e, v) => v && setOrientation(v)}>
                    <ToggleButton value="portrait"><StayCurrentPortraitIcon /></ToggleButton>
                    <ToggleButton value="landscape"><StayCurrentLandscapeIcon /></ToggleButton>
                </ToggleButtonGroup>
            </Box>
            
            <Box display="flex" justifyContent="center">
                <Paper elevation={6} sx={frameStyle}>
                    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                        {activityData.activityTypeId && content ? (
                            <ActivityRenderer
                                activityTypeId={activityData.activityTypeId}
                                content={content}
                            />
                        ) : (
                            <Typography p={2}>Select an activity type and provide JSON.</Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default DevicePreview;