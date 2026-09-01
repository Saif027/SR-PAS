// =========================================
// DATA MANAGEMENT
// =========================================


/*
 * Create a new empty student.
 */

function createEmptyStudent(
    name,
    id,
    department
) {

    const student = {

        name: name,

        id: id,

        department: department,

        semesters: []

    };


    for (let i = 1; i <= 8; i++) {

        student.semesters.push({

            semester: i,

            subjects: []

        });

    }


    return student;

}



// =========================================
// GET STUDENT DATA
// =========================================

function getStudentData() {

    const savedData =
        localStorage.getItem(
            "studentData"
        );


    if (!savedData) {

        return null;

    }


    return JSON.parse(savedData);

}



// =========================================
// SAVE STUDENT DATA
// =========================================

function saveStudentData(data) {

    localStorage.setItem(

        "studentData",

        JSON.stringify(data)

    );

}



// =========================================
// GET SEMESTER
// =========================================

function getSemesterData(
    student,
    semesterNumber
) {

    let semester =
        student.semesters.find(

            semester =>
                semester.semester ===
                Number(semesterNumber)

        );


    /*
     * Create semester if it doesn't exist.
     */

    if (!semester) {

        semester = {

            semester:
                Number(semesterNumber),

            subjects: []

        };


        student.semesters.push(
            semester
        );

    }


    return semester;

}



// =========================================
// GRADE POINT
// =========================================

function getGradePoint(marks) {

    if (marks >= 90) {

        return 10;

    }


    if (marks >= 80) {

        return 9;

    }


    if (marks >= 70) {

        return 8;

    }


    if (marks >= 60) {

        return 7;

    }


    if (marks >= 50) {

        return 6;

    }


    if (marks >= 40) {

        return 5;

    }


    return 0;

}



// =========================================
// GRADE
// =========================================

function getGrade(marks) {

    if (marks >= 90) {

        return "O";

    }


    if (marks >= 80) {

        return "A+";

    }


    if (marks >= 70) {

        return "A";

    }


    if (marks >= 60) {

        return "B+";

    }


    if (marks >= 50) {

        return "B";

    }


    if (marks >= 40) {

        return "C";

    }


    return "F";

}



// =========================================
// GPA
// =========================================

function calculateGPA(subjects) {

    if (!subjects || subjects.length === 0) {

        return 0;

    }


    let totalPoints = 0;

    let totalCredits = 0;


    subjects.forEach(subject => {

        const gradePoint =
            getGradePoint(
                Number(subject.marks)
            );


        totalPoints +=
            gradePoint *
            Number(subject.credits);


        totalCredits +=
            Number(subject.credits);

    });


    if (totalCredits === 0) {

        return 0;

    }


    return totalPoints / totalCredits;

}



// =========================================
// CGPA
// =========================================

function calculateCGPA(semesters) {

    if (!semesters) {

        return 0;

    }


    let totalPoints = 0;

    let totalCredits = 0;


    semesters.forEach(semester => {

        semester.subjects.forEach(
            subject => {

                const gradePoint =
                    getGradePoint(
                        Number(subject.marks)
                    );


                totalPoints +=
                    gradePoint *
                    Number(subject.credits);


                totalCredits +=
                    Number(subject.credits);

            }
        );

    });


    if (totalCredits === 0) {

        return 0;

    }


    return totalPoints / totalCredits;

}



// =========================================
// AVERAGE MARKS
// =========================================

function calculateAverageMarks(
    subjects
) {

    if (!subjects || subjects.length === 0) {

        return 0;

    }


    let total = 0;


    subjects.forEach(subject => {

        total +=
            Number(subject.marks);

    });


    return total / subjects.length;

}



// =========================================
// TOTAL CREDITS
// =========================================

function calculateTotalCredits(
    semesters
) {

    let total = 0;


    semesters.forEach(semester => {

        semester.subjects.forEach(
            subject => {

                total +=
                    Number(subject.credits);

            }
        );

    });


    return total;

}



// =========================================
// PASSED SUBJECTS
// =========================================

function calculatePassedSubjects(
    subjects
) {

    return subjects.filter(

        subject =>
            Number(subject.marks) >= 40

    ).length;

}



// =========================================
// COMPLETED SEMESTERS
// =========================================

function getCompletedSemesters(
    semesters
) {

    return semesters.filter(

        semester =>
            semester.subjects.length > 0

    );

}