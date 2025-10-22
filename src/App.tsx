import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, AppBar, Toolbar, Typography, Container, Button, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import your page components
import LevelsPage from './pages/LevelsPage';
import MainActivityPage from './pages/MainActivityPage';
import ActivityTypesPage from './pages/ActivityTypesPage';
import LessonsPage from './pages/LessonsPage';
import ActivitiesListPage from './pages/ActivitiesListPage';
import ActivityEditorPage from './pages/ActivityEditorPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/common/PrivateRoute';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading, logout } = useAuth();

    if (isLoading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    return (
        <>
            {isAuthenticated && (
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Tamil App Admin
                        </Typography>
                        <Button component={RouterLink} to="/levels" color="inherit">Levels</Button>
                        <Button component={RouterLink} to="/main-activities" color="inherit">Main Activities</Button>
                        <Button component={RouterLink} to="/activity-types" color="inherit">Activity Types</Button>
                        <Button onClick={logout} color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            )}
            <Container component="main" sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/levels"
                        element={<PrivateRoute><LevelsPage /></PrivateRoute>}
                    />
                    <Route
                        path="/lessons"
                        element={<PrivateRoute><LessonsPage /></PrivateRoute>}
                    />
                    <Route
                        path="/main-activities"
                        element={<PrivateRoute><MainActivityPage /></PrivateRoute>}
                    />
                    <Route
                        path="/activity-types"
                        element={<PrivateRoute><ActivityTypesPage /></PrivateRoute>}
                    />
                    <Route
                        path="/activities"
                        element={<PrivateRoute><ActivitiesListPage /></PrivateRoute>}
                    />
                    <Route
                        path="/activity-edit"
                        element={<PrivateRoute><ActivityEditorPage /></PrivateRoute>}
                    />
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/levels" : "/login"} />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;