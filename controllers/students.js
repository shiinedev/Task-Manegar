import Student from "../models/Student.js";


export const getStudents = async (req, res) => {
  const students = await Student.find();

  res.json(students);
};

export const getStudentInfo = async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) return res.status(404).send("student not found");

  res.json(student);
};

export const createStudent = async (req, res) => {
  const student = new Student(req.body);

  const saved = await student.save();

  res.status(201).json(saved);
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedStudent) return res.status(404).send("student not found");

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).send("server error", error);
  }
};
export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) return res.status(404).send("student not found");

    res.send("student deleted successfully");
  } catch (error) {
    res.res.status(404).send("server error",error);
  }
};


