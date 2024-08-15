import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Calendar from './components/Calendar';
import Teacher from './components/Teacher';
import Student from './components/Student';
import Register from './components/Register';
import Login from './components/Login';
import TaskPage from './components/TaskPage';
import StudentTaskPage from './components/StudentTaskPage';
import TaskDetailPage from './components/TaskDetailPage';
import StudentTaskDetailPage from './components/StudentTaskDetailPage';
import FrontPage from './components/FrontPage';


import 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="teacher" element={<Teacher />} />
                    <Route path="student" element={<Student />} />
                    <Route path="task/:classId" element={<TaskPage />} />
                    <Route path="task/:classId/:taskId" element={<TaskDetailPage />} /> {/* Add the new route */}
                    <Route path="studenttask/:classId" element={<StudentTaskPage />} />
                    <Route path="studenttask/:classId/:taskId/:workId" element={<StudentTaskDetailPage />} /> 
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
