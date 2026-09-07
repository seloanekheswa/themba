const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test backend
app.get("/", (req, res) => {
    res.send("Student Attendance Backend is running!");
});

// Get all students
app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students ORDER BY student_number";

    db.query(sql, (error, results) => {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Failed to get students"
            });
        }

        res.json(results);
    });
});

// Add a student
app.post("/api/students", (req, res) => {

    const {
        student_number,
        student_name,
        status
    } = req.body;

    const sql = `
        INSERT INTO students
        (student_number, student_name, status)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [student_number, student_name, status],
        (error, result) => {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Failed to add student"
                });
            }

            res.status(201).json({
                message: "Student added successfully",
                id: result.insertId
            });
        }
    );
});

// Update attendance
app.put("/api/students/:id", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE students
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, id],
        (error) => {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Failed to update attendance"
                });
            }

            res.json({
                message: "Attendance updated successfully"
            });
        }
    );
});

// Delete student
app.delete("/api/students/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (error) => {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Failed to delete student"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});