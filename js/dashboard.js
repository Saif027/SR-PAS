// =========================================
// LOAD DATA
// =========================================

const dashboardStudent =
    getStudentData();


if (!dashboardStudent) {

    window.location.href =
        "index.html";

}



// =========================================
// CURRENT SEMESTER
// =========================================

const dashboardSemester =
    Number(
        localStorage.getItem(
            "currentSemester"
        )
    ) || 1;



// =========================================
// STUDENT INFORMATION
// =========================================

document.getElementById(
    "studentName"
).textContent =
    dashboardStudent.name;


document.getElementById(
    "studentId"
).textContent =
    dashboardStudent.id;


document.getElementById(
    "department"
).textContent =
    dashboardStudent.department;


document.getElementById(
    "semester"
).textContent =
    "Semester " +
    dashboardSemester;



// =========================================
// COMPLETED SEMESTERS
// =========================================

const completedSemesters =
    getCompletedSemesters(
        dashboardStudent.semesters
    );


document.getElementById(
    "completedSemesters"
).textContent =
    completedSemesters.length;



// =========================================
// CURRENT SEMESTER DATA
// =========================================

const currentSemesterData =
    getSemesterData(

        dashboardStudent,

        dashboardSemester

    );


const currentSubjects =
    currentSemesterData.subjects;



// =========================================
// CURRENT GPA
// =========================================

const currentGPA =
    calculateGPA(
        currentSubjects
    );


document.getElementById(
    "gpa"
).textContent =
    currentGPA.toFixed(2);



// =========================================
// CGPA
// =========================================

const cgpa =
    calculateCGPA(
        dashboardStudent.semesters
    );


document.getElementById(
    "cgpa"
).textContent =
    cgpa.toFixed(2);



// =========================================
// AVERAGE MARKS
// =========================================

const average =
    calculateAverageMarks(
        currentSubjects
    );


document.getElementById(
    "averageMarks"
).textContent =
    average.toFixed(2);



// =========================================
// TOTAL CREDITS
// =========================================

const totalCredits =
    calculateTotalCredits(
        dashboardStudent.semesters
    );


document.getElementById(
    "totalCredits"
).textContent =
    totalCredits;



// =========================================
// SUBJECT CHART
// =========================================

const subjectNames =
    currentSubjects.map(

        subject =>
            subject.name

    );


const subjectMarks =
    currentSubjects.map(

        subject =>
            Number(subject.marks)

    );



new Chart(

    document.getElementById(
        "subjectChart"
    ),

    {

        type: "bar",

        data: {

            labels: subjectNames,

            datasets: [

                {

                    label: "Marks",

                    data: subjectMarks

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100,

                    title: {

                        display: true,

                        text: "Marks"

                    }

                }

            }

        }

    }

);



// =========================================
// SEMESTER GPA CHART
// =========================================

const semesterLabels =
    completedSemesters.map(

        semester =>
            "Semester " +
            semester.semester

    );


const semesterGPAs =
    completedSemesters.map(

        semester =>
            Number(
                calculateGPA(
                    semester.subjects
                ).toFixed(2)
            )

    );



new Chart(

    document.getElementById(
        "semesterChart"
    ),

    {

        type: "line",

        data: {

            labels: semesterLabels,

            datasets: [

                {

                    label: "GPA",

                    data: semesterGPAs,

                    tension: 0.3,

                    fill: false

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 10,

                    title: {

                        display: true,

                        text: "GPA"

                    }

                }

            }

        }

    }

);



// =========================================
// ACADEMIC PROGRESS
// =========================================

function displaySemesterProgress() {

    const container =
        document.getElementById(
            "semesterProgress"
        );


    container.innerHTML = "";


    if (
        completedSemesters.length === 0
    ) {

        container.innerHTML = `

            <p class="text-muted">

                No semester results available yet.

                Go to

                <a href="result.html">
                    Manage Results
                </a>

                to add results.

            </p>

        `;

        return;

    }


    completedSemesters.forEach(
        semester => {

            const gpa =
                calculateGPA(
                    semester.subjects
                );


            const percentage =
                Math.min(
                    (gpa / 10) * 100,
                    100
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "mb-4";


            row.innerHTML = `

                <div class="d-flex justify-content-between">

                    <strong>
                        Semester ${semester.semester}
                    </strong>

                    <strong>
                        GPA: ${gpa.toFixed(2)}
                    </strong>

                </div>

                <div class="progress mt-2">

                    <div
                        class="progress-bar"
                        style="width: ${percentage}%"
                    >
                    </div>

                </div>

                <small class="text-muted">

                    ${semester.subjects.length}
                    subjects

                </small>

            `;


            container.appendChild(row);

        }
    );

}


displaySemesterProgress();



// =========================================
// PERFORMANCE INSIGHTS
// =========================================

function generateInsights() {

    const container =
        document.getElementById(
            "insights"
        );


    if (
        currentSubjects.length === 0
    ) {

        container.innerHTML = `

            <p class="text-muted">

                No results are available for

                Semester ${dashboardSemester}.

                Add subjects to view performance insights.

            </p>

        `;

        return;

    }


    let highest =
        currentSubjects[0];


    let lowest =
        currentSubjects[0];


    currentSubjects.forEach(
        subject => {

            if (
                Number(subject.marks) >
                Number(highest.marks)
            ) {

                highest = subject;

            }


            if (
                Number(subject.marks) <
                Number(lowest.marks)
            ) {

                lowest = subject;

            }

        }
    );


    const passed =
        calculatePassedSubjects(
            currentSubjects
        );


    const passPercentage =
        (
            passed /
            currentSubjects.length
        ) * 100;


    let performanceMessage;


    if (currentGPA >= 9) {

        performanceMessage =
            "Excellent academic performance.";

    }
    else if (currentGPA >= 8) {

        performanceMessage =
            "Very good academic performance.";

    }
    else if (currentGPA >= 7) {

        performanceMessage =
            "Good academic performance.";

    }
    else if (currentGPA >= 6) {

        performanceMessage =
            "Satisfactory performance with room for improvement.";

    }
    else {

        performanceMessage =
            "Academic performance needs improvement.";

    }


    container.innerHTML = `

        <div class="row">

            <div class="col-md-6">

                <p>

                    <strong>
                        Strongest Subject:
                    </strong>

                    ${highest.name}

                    (${highest.marks} marks)

                </p>


                <p>

                    <strong>
                        Subject to Improve:
                    </strong>

                    ${lowest.name}

                    (${lowest.marks} marks)

                </p>

            </div>


            <div class="col-md-6">

                <p>

                    <strong>
                        Subjects Passed:
                    </strong>

                    ${passed}/${currentSubjects.length}

                    (${passPercentage.toFixed(0)}%)

                </p>


                <p>

                    <strong>
                        Overall Assessment:
                    </strong>

                    ${performanceMessage}

                </p>

            </div>

        </div>

    `;

}


generateInsights();