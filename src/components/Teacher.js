import React, { useState, useEffect } from 'react';
import {
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Grid,
    Box,
    IconButton,
    Container,
    CssBaseline,
    Snackbar,
    Alert,
    Fab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ref, push, remove, onValue, query, orderByChild, equalTo, set } from 'firebase/database';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import { db } from './firebasec';

function Teacher() {
    const [open, setOpen] = useState(false);
    const [className, setClassName] = useState('');
    const [subject, setSubject] = useState('');
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [studentsDialogOpen, setStudentsDialogOpen] = useState(false);
    const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedClassCode, setSelectedClassCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            setEmail(userEmail);
            fetchClasses(userEmail);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const fetchClasses = (userEmail) => {
        const classesRef = query(ref(db, 'classes'), orderByChild('email'), equalTo(userEmail));
        onValue(classesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedClasses = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setClasses(parsedClasses);
            } else {
                setClasses([]);
            }
        });
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!className || !subject) {
            setError('Class name and subject are required');
            return;
        }

        try {
            const classNameRef = query(ref(db, 'classes'), orderByChild('className'), equalTo(className));
            onValue(classNameRef, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setError('A class with this name already exists');
                } else {
                    const generateCode = () => Math.floor(10000 + Math.random() * 90000).toString();
                    const classCode = generateCode();

                    try {
                        const classRef = ref(db, 'classes');
                        await push(classRef, {
                            className,
                            subject,
                            email,
                            code: classCode
                        });
                        setClassName('');
                        setSubject('');
                        setOpen(false);
                    } catch (error) {
                        setError(`An error occurred while creating the class: ${error.message}`);
                    }
                }
            }, { onlyOnce: true });
        } catch (error) {
            setError(`An error occurred while checking for existing classes: ${error.message}`);
        }
    };

    const handleDelete = async (e, classId, classCode) => {
        e.stopPropagation();
        try {
            const classRef = ref(db, `classes/${classId}`);
            const tasksRef = ref(db, `tasks/${classCode}`);

            await remove(tasksRef);
            await remove(classRef);
        } catch (error) {
            console.error("Error deleting class or tasks:", error.message);
        }
    };

    const handleClassClick = (classCode) => {
        navigate(`/home/task/${classCode}`);
    };

    const handleCodeClick = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbarOpen(true);
    };

    const handleViewStudents = (classCode) => {
        setSelectedClassCode(classCode);
        fetchStudents(classCode);
        setStudentsDialogOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);
    const handleStudentsDialogClose = () => setStudentsDialogOpen(false);
    const handleAnnouncementDialogClose = () => setAnnouncementDialogOpen(false);

    const fetchStudents = (classCode) => {
        const studentsRef = query(ref(db, 'joinclass'), orderByChild('classCode'), equalTo(classCode));
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedStudents = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setStudents(parsedStudents);
            } else {
                setStudents([]);
            }
        });
    };

    const handleAnnouncement = (classCode) => {
        setSelectedClassCode(classCode);
        setAnnouncementDialogOpen(true);
    };

    const handleSendAnnouncement = async () => {
        if (!announcement) return;

        try {
            const announcementRef = ref(db, `announcements/${selectedClassCode}`);

            // Remove any existing announcement before setting the new one
            await remove(announcementRef);

            // Add the new announcement
            await set(announcementRef, {
                message: announcement,
                timestamp: new Date().toISOString()
            });

            setAnnouncement('');
            setAnnouncementDialogOpen(false);
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error sending announcement:", error.message);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4
                }}
            >
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleClickOpen}
                    sx={{ position: 'fixed', bottom: 16, right: 16, backgroundColor: '#008080', color: '#fff' }}
                >
                    <AddIcon />
                </Fab>

                <Grid container spacing={2}>
                    {classes.map(({ id, className, subject, code }) => (
                        <Grid item key={id} xs={12} sm={6} md={4}>
                            <Card sx={{ cursor: 'pointer' }} onClick={() => handleClassClick(code)}>
                                <CardContent>
                                    <Typography variant="h6">{className}</Typography>
                                    <Typography variant="body2">{subject}</Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCodeClick(code);
                                        }}
                                    >
                                        Class Code: {code}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        startIcon={<PeopleIcon />}
                                        sx={{ color: '#008080' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewStudents(code);
                                        }}
                                    >
                                        Students
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<CampaignIcon />}
                                        sx={{ color: '#008080' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnnouncement(code);
                                        }}
                                    >
                                        Announce
                                    </Button>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={(e) => handleDelete(e, id, code)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Create a new class</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create a new class, please enter the class name and subject here.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Class Name"
                            type="text"
                            fullWidth
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Subject"
                            type="text"
                            fullWidth
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">Cancel</Button>
                        <Button onClick={handleCreate} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={studentsDialogOpen} onClose={handleStudentsDialogClose}>
                    <DialogTitle>Student List</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Here are the students who have joined the class:
                        </DialogContentText>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <Typography key={student.id} variant="body1">
                                    {student.name} ({student.email})
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="body2">No students have joined this class yet.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleStudentsDialogClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={announcementDialogOpen} onClose={handleAnnouncementDialogClose}>
                    <DialogTitle>Make an Announcement</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter your announcement below:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Announcement"
                            type="text"
                            fullWidth
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAnnouncementDialogClose} color="primary">Cancel</Button>
                        <Button onClick={handleSendAnnouncement} color="primary">Send</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        Action completed successfully!
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}

export default Teacher;
