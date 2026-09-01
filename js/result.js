// =========================================
// LOAD STUDENT
// =========================================

let studentData =
    getStudentData();


/*
 * If there is no student data,
 * return to the starting page.
 */

if (!studentData) {

    window.location.href =
        "index.html";

}



// =========================================
// CURRENT SEMESTER
// =========================================

let currentSemester =
    Number(
        localStorage.getItem(
            "currentSemester"
        )
    ) || 1;



// Set selector

document.getElementById(
    "semesterSelect"
).value =
    currentSemester;



// =========================================
// SEMESTER CHANGE
// =========================================

document
    .getElementById("semesterSelect")
    .addEventListener(
        "change",
        function() {

            currentSemester =
                Number(this.value);


            localStorage.setItem(
                "currentSemester",
                currentSemester
            );


            displayResults();

        }
    );



// =========================================
// GET CURRENT SEMESTER
// =========================================

function getCurrentSemester() {

    return getSemesterData(

        studentData,

        currentSemester

    );

}



// =========================================
// DISPLAY RESULTS
// =========================================

function displayResults() {

    const semester =
        getCurrentSemester();


    const subjects =
        semester.subjects;


    const table =
        document.getElementById(
            "resultTable"
        );


    table.innerHTML = "";


    subjects.forEach(
        (subject, index) => {

            const grade =
                getGrade(
                    Number(subject.marks)
                );


            const gradePoint =
                getGradePoint(
                    Number(subject.marks)
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(subject.name)}
                </td>

                <td>
                    ${subject.marks}
                </td>

                <td>
                    ${subject.credits}
                </td>

                <td>

                    <span class="badge bg-primary">

                        ${grade}

                    </span>

                </td>

                <td>
                    ${gradePoint}
                </td>

                <td>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="removeSubject(${index})"
                    >
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );


    updateSummary(subjects);

}



// =========================================
// UPDATE SUMMARY
// =========================================

function updateSummary(subjects) {

    const gpa =
        calculateGPA(subjects);


    const credits =
        subjects.reduce(

            (total, subject) =>
                total +
                Number(subject.credits),

            0

        );


    const average =
        calculateAverageMarks(subjects);


    document.getElementById(
        "gpa"
    ).textContent =
        gpa.toFixed(2);


    document.getElementById(
        "semesterGPA"
    ).textContent =
        gpa.toFixed(2);


    document.getElementById(
        "totalCredits"
    ).textContent =
        credits;


    document.getElementById(
        "averageMarks"
    ).textContent =
        average.toFixed(2);


    document.getElementById(
        "subjectCount"
    ).textContent =

        subjects.length +
        (
            subjects.length === 1
                ? " Subject"
                : " Subjects"
        );

}



// =========================================
// ADD SUBJECT
// =========================================

function addSubject() {

    const name =
        document
            .getElementById(
                "subjectName"
            )
            .value
            .trim();


    const marks =
        Number(
            document.getElementById(
                "marks"
            ).value
        );


    const credits =
        Number(
            document.getElementById(
                "credits"
            ).value
        );


    // Subject validation

    if (!name) {

        alert(
            "Please enter the subject name."
        );

        return;

    }


    // Marks validation

    if (
        isNaN(marks) ||
        marks < 0 ||
        marks > 100
    ) {

        alert(
            "Marks must be between 0 and 100."
        );

        return;

    }


    // Credits validation

    if (
        isNaN(credits) ||
        credits <= 0 ||
        credits > 10
    ) {

        alert(
            "Credits must be between 1 and 10."
        );

        return;

    }


    const semester =
        getCurrentSemester();


    /*
     * Prevent duplicate subject names.
     */

    const duplicate =
        semester.subjects.some(

            subject =>
                subject.name.toLowerCase() ===
                name.toLowerCase()

        );


    if (duplicate) {

        alert(
            "This subject already exists in this semester."
        );

        return;

    }


    semester.subjects.push({

        name: name,

        marks: marks,

        credits: credits

    });


    saveStudentData(
        studentData
    );


    // Clear fields

    document.getElementById(
        "subjectName"
    ).value = "";


    document.getElementById(
        "marks"
    ).value = "";


    document.getElementById(
        "credits"
    ).value = "";


    displayResults();

}



// =========================================
// DELETE SUBJECT
// =========================================

function removeSubject(index) {

    const semester =
        getCurrentSemester();


    const subject =
        semester.subjects[index];


    if (!subject) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${subject.name}?`
        );


    if (!confirmed) {

        return;

    }


    semester.subjects.splice(
        index,
        1
    );


    saveStudentData(
        studentData
    );


    displayResults();

}



// =========================================
// HTML ESCAPE
// =========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



// =========================================
// INITIALIZE
// =========================================

displayResults();