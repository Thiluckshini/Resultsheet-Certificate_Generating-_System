# 🎓 Edu Certify - Result Sheet and Certificate Generator

**Edu Certify** is a web-based application designed for educational institutes to efficiently generate academic result sheets and class certificates for students. It supports **role-based dashboards** for super admin, institute admins,  lecturers and, studnets allows **secure data management**, and provides **PDF generation** for results and certificates.

---

## 🚀 Features

- ✅ Admin & Lecturer Role Management  
- 📋 Student & Subject Management  
- 📚 Marks Entry by Lecturers  
- 🧮 Automatic GPA Calculation  
- 🏅 Class Certificate Generation (1st Class, 2nd Class, etc.)  
- 📄 PDF Download for Result Sheets & Certificates  
- 🏫 Grouped Views by Institute, Department, and Semester/Year  

---

## 🛠️ Technologies Used

### Frontend
- React (Next.js)  
- Tailwind CSS  
- jsPDF – For generating PDFs  
- Axios – For API communication  

### Backend
- Node.js  
- Express  
- MySQL / MariaDB  
- Sequelize or Raw SQL  

---

## 🔐 Roles and Permissions

| Role            | Permissions                                                             |
|-----------------|-------------------------------------------------------------------------|
| **Admin**       | Full access: manage all students, lecturers, subjects, and marks        |
| **Institute Admin** | Access limited to their institute data                              |
| **Lecturer**    | Can only manage/view students in their department within the same institute |
| **Student**     | Can view and download their specific resultsheet and certificate        |

---





