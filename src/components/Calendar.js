import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ref, onValue, off } from 'firebase/database';
import { db } from './firebasec'; // Ensure your Firebase configuration is correct
import { format } from 'date-fns';

function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const [classNames, setClassNames] = useState({}); // State to store class names

    useEffect(() => {
        // Fetch user email from local storage
        const email = localStorage.getItem('userEmail');
        setUserEmail(email || '');
    }, []);

    useEffect(() => {
        if (!userEmail) return;

        const fetchTasksAndClassNames = async () => {
            try {
                setLoading(true);

                // Fetch the classes the student has joined
                const joinedClassesRef = ref(db, 'joinclass');
                const tasksRef = ref(db, 'tasks');
                const classNamesRef = ref(db, 'classes');

                onValue(joinedClassesRef, (snapshot) => {
                    const joinedClasses = [];
                    snapshot.forEach((classSnapshot) => {
                        const classData = classSnapshot.val();
                        if (classData.email === userEmail) {
                            joinedClasses.push(classData.classCode);
                        }
                    });

                    if (joinedClasses.length > 0) {
                        onValue(tasksRef, (taskSnapshot) => {
                            const allTasks = [];
                            const data = taskSnapshot.val();

                            if (data) {
                                Object.keys(data).forEach(classId => {
                                    if (joinedClasses.includes(classId)) {
                                        const classTasks = data[classId];
                                        Object.keys(classTasks).forEach(taskId => {
                                            const taskDetails = classTasks[taskId];
                                            Object.keys(taskDetails.work || {}).forEach(workId => {
                                                const work = taskDetails.work[workId];
                                                if (work.scheduledDateTime) {
                                                    allTasks.push({
                                                        id: workId,
                                                        taskName: taskDetails.task,
                                                        workDescription: work.workDescription || 'No Work Description', // Use workDescription here
                                                        classId: classId,
                                                        taskId: taskId,
                                                        ...work
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                                setTasks(allTasks);
                            }
                        });

                        onValue(classNamesRef, (classSnapshot) => {
                            const classes = {};
                            classSnapshot.forEach((snap) => {
                                const classData = snap.val();
                                classes[classData.code] = classData.className; // Use `code` for mapping
                            });
                            setClassNames(classes);
                        });
                    } else {
                        setTasks([]);
                    }
                });
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasksAndClassNames();

        return () => {
            // Clean up listeners
            off(ref(db, 'tasks'));
            off(ref(db, 'joinclass'));
            off(ref(db, 'classes'));
        };
    }, [userEmail]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        const formattedDate = format(newDate, "dd MMMM yyyy");
        const filteredTasks = tasks.filter(task => task.scheduledDateTime.includes(formattedDate));
        setTasksForSelectedDate(filteredTasks);
    };

    const tileContent = ({ date }) => {
        const formattedDate = format(date, "dd MMMM yyyy");
        const tasksForTileDate = tasks.filter(task => task.scheduledDateTime.includes(formattedDate));
        return tasksForTileDate.length > 0 ? (
            <Typography variant="caption" color="primary">
                • {tasksForTileDate.length} Task{tasksForTileDate.length > 1 ? 's' : ''}
            </Typography>
        ) : null;
    };

    return (
        <Container
            component="main"
            maxWidth="md"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}
        >
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileContent={tileContent}
            />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Tasks for {format(date, "dd MMMM yyyy")}</Typography>
            {loading ? (
                <Typography>Loading tasks...</Typography>
            ) : (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {tasksForSelectedDate.length > 0 ? (
                        tasksForSelectedDate.map(task => (
                            <Grid item xs={12} sm={6} key={task.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {task.taskName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {task.scheduledDateTime}
                                        </Typography>
                                        <Typography variant="body2" color="text.primary">
                                            Class: {classNames[task.classId] || 'Unknown'}
                                        </Typography>
                                        <Typography variant="body2" color="text.primary">
                                            Work: {task.workDescription || 'No Work Description'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>No tasks for this date.</Typography>
                    )}
                </Grid>
            )}
        </Container>
    );
}

export default CalendarPage;
