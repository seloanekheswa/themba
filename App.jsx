import { useEffect, useState } from "react";
import "./App.css";

function App() {

    const [students, setStudents] = useState([]);

    const [studentNumber, setStudentNumber] = useState("");
    const [studentName, setStudentName] = useState("");
    const [status, setStatus] = useState("present");

    // Get students from backend
    const getStudents = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/students"
            );

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.log("Error:", error);

        }
    };

    // Load students when page opens
    useEffect(() => {
        getStudents();
    }, []);

    // Add student
    const addStudent = async (event) => {

        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/students",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        student_number: studentNumber,
                        student_name: studentName,
                        status: status
                    })
                }
            );

            const data = await response.json();

            alert(data.message);

            setStudentNumber("");
            setStudentName("");
            setStatus("present");

            getStudents();

        } catch (error) {

            console.log("Error:", error);

        }
    };

    // Change attendance
    const changeStatus = async (id, newStatus) => {

        try {

            await fetch(
                `http://localhost:5000/api/students/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            getStudents();

        } catch (error) {

            console.log("Error:", error);

        }
    };

    // Delete student
    const deleteStudent = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await fetch(
                `http://localhost:5000/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );

            getStudents();

        } catch (error) {

            console.log("Error:", error);

        }
    };

    return (
        <div className="container">

            <h1>Student Attendance Management</h1>

            <p className="description">
                Manage student attendance using React, Express and MySQL.
            </p>

            {/* Add Student Form */}

            <div className="form-container">

                <h2>Add Student</h2>

                <form onSubmit={addStudent}>

                    <input
                        type="number"
                        placeholder="Student Number"
                        value={studentNumber}
                        onChange={(event) =>
                            setStudentNumber(event.target.value)
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Student Name"
                        value={studentName}
                        onChange={(event) =>
                            setStudentName(event.target.value)
                        }
                        required
                    />

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                    >
                        <option value="present">
                            Present
                        </option>

                        <option value="absent">
                            Absent
                        </option>
                    </select>

                    <button type="submit">
                        Add Student
                    </button>

                </form>

            </div>

            {/* Student Table */}

            <div className="table-container">

                <h2>Student Attendance</h2>

                <table>

                    <thead>

                        <tr>
                            <th>Student Number</th>
                            <th>Student Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {students.map((student) => (

                            <tr key={student.id}>

                                <td>
                                    {student.student_number}
                                </td>

                                <td>
                                    {student.student_name}
                                </td>

                                <td className={
                                    student.status === "present"
                                        ? "present"
                                        : "absent"
                                }>
                                    {student.status}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            changeStatus(
                                                student.id,
                                                student.status === "present"
                                                    ? "absent"
                                                    : "present"
                                            )
                                        }
                                    >
                                        Mark {
                                            student.status === "present"
                                                ? "Absent"
                                                : "Present"
                                        }
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deleteStudent(student.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default App;