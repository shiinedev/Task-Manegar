
import express from 'express'
import { getStudents, getStudentInfo, createStudent, updateStudent, deleteStudent } from '../controllers/students.js';

const router = express.Router();


router.get("/",getStudents);
router.get("/:id",getStudentInfo)
router.post("/create",createStudent)
router.put("/update/:id",updateStudent)
router.delete("/delete/:id",deleteStudent)



export default router