import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DependentCrudApiService } from '../../api/apiService.types';

// --- Props Definition ---
interface ColumnDef<T> {
    field: keyof T;
    headerName: string;
    type?: 'string' | 'number';
}

interface DependentInlineCrudTableProps<T, TCreateDto> {
    entityName: string;
    parentName?: string;
    parentRoute: string; // e.g., '/levels'
    parentId: number | string;
    apiService: DependentCrudApiService<T, TCreateDto>;
    columns: ColumnDef<T>[];
    idField: keyof T;
    renderCustomActions?: (item: T) => React.ReactNode;
    initialData?: T[]; // *** NEW: Add optional initialData prop ***
}

// --- The Generic Dependent Component ---
const DependentInlineCrudTable = <T extends Record<string, any>, TCreateDto extends object>({
    entityName,
    parentName,
    parentRoute,
    parentId,
    apiService,
    columns,
    idField,
    renderCustomActions,
    initialData
}: DependentInlineCrudTableProps<T, TCreateDto>) => {
    const [items, setItems] = useState<T[]>(initialData || []); // *** Use initialData if provided ***
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editRowId, setEditRowId] = useState<number | string | null>(null);
    const [editedRowData, setEditedRowData] = useState<Partial<TCreateDto> | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        // If we were given initial data, we don't need to fetch on the first load.
        if (initialData && items.length > 0) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const data = await apiService.getAllByParentId(parentId);
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [apiService, parentId, initialData, items.length]); // Add dependencies

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (item: T) => {
        setEditRowId(item[idField]);
        // Dynamically create the initial edit object based on columns
        const initialEditData: Partial<TCreateDto> = {};
        columns.forEach(col => {
            (initialEditData as any)[col.field] = item[col.field];
        });
        setEditedRowData(initialEditData);
    };


    const handleCancel = () => {
        setEditRowId(null);
        setEditedRowData(null);
        setIsAdding(false);
    };

    const handleSave = async () => {
        if (!editRowId || !editedRowData) return;
        try {
            await apiService.update(editRowId, editedRowData);
            handleCancel();
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddNew = async () => {
        if (!editedRowData) return;
        try {
            await apiService.create(editedRowData as TCreateDto);
            handleCancel();
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm(`Are you sure you want to delete this ${entityName}?`)) {
            try {
                await apiService.delete(id);
                await fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const column = columns.find(c => c.field === name);
        const parsedValue = column?.type === 'number' ? parseInt(value, 10) || 0 : value;
        setEditedRowData(prev => ({ ...prev!, [name]: parsedValue }));
    };


    const renderRow = (item: T) => {
        const id = item[idField];
        const isEditing = editRowId === id;
        return (
            <TableRow key={id}>
                <TableCell>{id}</TableCell>
                {columns.map(col => (
                    <TableCell key={String(col.field)}>
                        {isEditing ? (
                            <TextField
                                name={String(col.field)}
                                type={col.type === 'number' ? 'number' : 'text'}
                                value={(editedRowData as any)?.[col.field] ?? ''}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                            />
                        ) : (
                            item[col.field]
                        )}
                    </TableCell>
                ))}
                <TableCell>
                    {isEditing ? (
                        <>
                            <IconButton onClick={handleSave} color="primary"><SaveIcon /></IconButton>
                            <IconButton onClick={handleCancel}><CancelIcon /></IconButton>
                        </>
                    ) : (
                        <>
                            {renderCustomActions && renderCustomActions(item)}
                            <IconButton onClick={() => handleEdit(item)} color="primary"><EditIcon /></IconButton>
                            <IconButton onClick={() => handleDelete(id)} color="error"><DeleteIcon /></IconButton>
                        </>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    const renderAddRow = () => {
        // Create an initial empty object for the new row
        const initialAddData: Partial<TCreateDto> = {};
        columns.forEach(col => {
            (initialAddData as any)[col.field] = col.type === 'number' ? 0 : '';
        });

        return (
            <TableRow>
                <TableCell>(New)</TableCell>
                {columns.map(col => (
                    <TableCell key={String(col.field)}>
                        <TextField
                            name={String(col.field)}
                            placeholder={col.headerName}
                            type={col.type === 'number' ? 'number' : 'text'}
                            value={(editedRowData as any)?.[col.field] ?? ''}
                            onChange={handleInputChange}
                            size="small"
                            fullWidth
                            autoFocus={columns.indexOf(col) === 0}
                        />
                    </TableCell>
                ))}
                <TableCell>
                    <IconButton onClick={handleAddNew} color="primary"><SaveIcon /></IconButton>
                    <IconButton onClick={handleCancel}><CancelIcon /></IconButton>
                </TableCell>
            </TableRow>
        );
    };


    return (
        <Box p={3}>
            <IconButton onClick={() => navigate(parentRoute)} sx={{ mb: 2 }}>
                <ArrowBackIcon />
                <Typography variant="button" sx={{ ml: 1 }}>Back to {parentName || 'Parent'}</Typography>
            </IconButton>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">Manage {entityName}s for: "{parentName}"</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAdding(true)}>
                    Add New {entityName}
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            {columns.map(col => <TableCell key={String(col.field)}>{col.headerName}</TableCell>)}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={columns.length + 2} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                            items.map(renderRow)
                        )}
                        {isAdding && renderAddRow()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DependentInlineCrudTable;