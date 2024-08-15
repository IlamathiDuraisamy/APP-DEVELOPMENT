import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, push, remove } from 'firebase/database';
import {
    Container,
    CssBaseline,
    Typography,
    TextField,
    Button,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from './firebasec';

function TaskPage() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const tasksRef = ref(db, `tasks/${classId}`);
        onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedTasks = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setTasks(parsedTasks);
            } else {
                setTasks([]);
            }
        });
    }, [classId]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!task || !description) {
            setError('Title and description are required');
            return;
        }

        try {
            const tasksRef = ref(db, `tasks/${classId}`);
            await push(tasksRef, { task, description });
            setTask('');
            setDescription('');
            setError('');
            setOpen(false);
            setSnackbarOpen(true);
        } catch (error) {
            setError(`An error occurred: ${error.message}`);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const taskRef = ref(db, `tasks/${classId}/${taskId}`);
            await remove(taskRef);
        } catch (error) {
            setError(`An error occurred: ${error.message}`);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTaskClick = (taskId) => {
        navigate(`/home/task/${classId}/${taskId}`);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline />
            <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ mb: 2,backgroundColor: '#008080', color: '#fff' }}>
                + Add New Task
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the title and description for the new task.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddTask} color="primary" >
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Task added successfully!
                </Alert>
            </Snackbar>
            <Grid container spacing={2}>
                {tasks.map(({ id, task, description }) => (
                    <Grid item key={id} xs={12} sm={6} md={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '150px',
                                boxShadow: 3,
                                borderRadius: 2
                            }}
                            onClick={() => handleTaskClick(id)}
                        >
                            <CardContent>
                                <Typography variant="h6" noWrap gutterBottom>
                                    {task}
                                </Typography>
                                <Typography color="textSecondary" noWrap>
                                    {description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleDeleteTask(id); }}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default TaskPage;
