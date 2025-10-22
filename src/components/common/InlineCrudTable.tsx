import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { CrudApiService } from '../../api/apiService.types';

// --- Generic Props Definition ---
export interface ColumnDef<T, TCreateDto> {
    field: keyof T;
    headerName: string;
    type?: 'string' | 'number';
    // Renders the cell in DISPLAY mode (optional)
    renderCell?: (value: any, row: T) => React.ReactNode;
    // Renders the cell in EDIT mode (optional)
    renderEditCell?: (
        value: any,
        onChange: (field: keyof TCreateDto, value: any) => void
    ) => React.ReactNode;
}

interface InlineCrudTableProps<T, TCreateDto> {
    entityName: string;
    apiService: CrudApiService<T, TCreateDto>;
    columns: ColumnDef<T, TCreateDto>[]; // Use the corrected ColumnDef
    idField: keyof T;
    renderCustomActions?: (item: T) => React.ReactNode;
}

// --- The Generic Component ---
const InlineCrudTable = <T extends Record<string, any>, TCreateDto extends object>({
    entityName,
    apiService,
    columns,
    idField,
    renderCustomActions
}: InlineCrudTableProps<T, TCreateDto>) => {
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editRowId, setEditRowId] = useState<number | string | null>(null);
    const [editedRowData, setEditedRowData] = useState<Partial<TCreateDto> | null>(null);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getAll();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [apiService]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBeginAdding = () => {
        // Create the initial empty state object here, ONCE.
        const initialAddData: Partial<TCreateDto> = {};
        columns.forEach(col => {
            // Set default values for the new row's state
            (initialAddData as any)[col.field] = col.type === 'number' ? 0 : '';
        });
        setEditedRowData(initialAddData); // Set the state for the new row
        setIsAdding(true); // Go into "adding" mode
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

    const handleEdit = (item: T) => {
        setEditRowId(item[idField]);
        const initialEditData: Partial<TCreateDto> = {};
        columns.forEach(col => {
            // Note: We cast col.field to keyof TCreateDto. This assumes field names are consistent.
            (initialEditData as any)[col.field] = item[col.field];
        });
        setEditedRowData(initialEditData);
    };

    const handleInputChange = (field: keyof TCreateDto, value: any) => {
        const column = columns.find(c => c.field === field);
        const parsedValue = column?.type === 'number' ? parseInt(value, 10) || 0 : value;
        setEditedRowData(prev => ({ ...prev!, [field]: parsedValue }));
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
                            // Use custom edit cell renderer if provided
                            col.renderEditCell ? (
                                col.renderEditCell(
                                    (editedRowData as any)?.[col.field] ?? '',
                                    handleInputChange
                                )
                            ) : (
                                // Fallback to a standard TextField
                                <TextField
                                    name={String(col.field)}
                                    type={col.type === 'number' ? 'number' : 'text'}
                                    value={(editedRowData as any)?.[col.field] ?? ''}
                                    onChange={(e) => handleInputChange(col.field as any, e.target.value)}
                                    size="small"
                                    fullWidth
                                />
                            )
                        ) : (
                            // Use custom display cell renderer if provided
                            col.renderCell ? (
                                col.renderCell(item[col.field], item)
                            ) : (
                                // Fallback to simple text display
                                item[col.field]
                            )
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
        // This function now just renders the UI. It doesn't set state.
        return (
            <TableRow>
                <TableCell>(New)</TableCell>
                {columns.map((col, index) => (
                    <TableCell key={String(col.field)}>
                        {/* Check for a custom edit cell renderer first */}
                        {col.renderEditCell ? (
                            col.renderEditCell(
                                (editedRowData as any)?.[col.field] ?? '',
                                handleInputChange
                            )
                        ) : (
                            // Fallback to the default TextField
                            <TextField
                                name={String(col.field)}
                                placeholder={col.headerName}
                                type={col.type === 'number' ? 'number' : 'text'}
                                value={(editedRowData as any)?.[col.field] ?? ''}
                                // *** THE FIX IS HERE ***
                                // Wrap the call in an arrow function to pass the correct arguments
                                onChange={(e) => handleInputChange(col.field as any, e.target.value)}
                                size="small"
                                fullWidth
                                autoFocus={index === 0}
                            />
                        )}
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" component="h1">Manage {entityName}s</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleBeginAdding}>
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

export default InlineCrudTable;