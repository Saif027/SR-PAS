// =========================================
// LOAD DATA
// =========================================

const reportStudent = getStudentData();


if (!reportStudent) {

    window.location.href = "index.html";

}



// =========================================
// STUDENT INFORMATION
// =========================================

document.getElementById("studentName").textContent =
    reportStudent.name;


document.getElementById("studentId").textContent =
    reportStudent.id;


document.getElementById("department").textContent =
    reportStudent.department;


document.getElementById("reportDate").textContent =
    new Date().toLocaleDateString();



// =========================================
// COMPLETED SEMESTERS
// =========================================

const reportSemesters =
    getCompletedSemesters(
        reportStudent.semesters
    );



// =========================================
// CGPA
// =========================================

const reportCGPA =
    calculateCGPA(
        reportStudent.semesters
    );


document.getElementById("cgpa").textContent =
    reportCGPA.toFixed(2);



// =========================================
// TOTAL CREDITS
// =========================================

const reportCredits =
    calculateTotalCredits(
        reportStudent.semesters
    );


document.getElementById("totalCredits").textContent =
    reportCredits;



// =========================================
// COMPLETED SEMESTERS
// =========================================

document.getElementById("completedSemesters").textContent =
    reportSemesters.length;



// =========================================
// ALL SUBJECTS
// =========================================

let allSubjects = [];


reportSemesters.forEach(semester => {

    allSubjects =
        allSubjects.concat(
            semester.subjects
        );

});



// =========================================
// OVERALL AVERAGE
// =========================================

const overallAverage =
    calculateAverageMarks(
        allSubjects
    );


document.getElementById("overallAverage").textContent =
    overallAverage.toFixed(2);



// =========================================
// CREATE SEMESTER REPORTS
// =========================================

const semesterReports =
    document.getElementById(
        "semesterReports"
    );


semesterReports.innerHTML = "";



reportSemesters.forEach(semester => {

    const gpa =
        calculateGPA(
            semester.subjects
        );


    const credits =
        semester.subjects.reduce(

            (total, subject) => {

                return total +
                    Number(subject.credits);

            },

            0

        );


    const average =
        calculateAverageMarks(
            semester.subjects
        );


    const section =
        document.createElement("div");


    section.className =
        "report-semester mb-5";


    let rows = "";


    semester.subjects.forEach(
        (subject, index) => {

            const grade =
                getGrade(
                    Number(subject.marks)
                );


            const gradePoint =
                getGradePoint(
                    Number(subject.marks)
                );


            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            subject.name
                        )}
                    </td>

                    <td>
                        ${subject.marks}
                    </td>

                    <td>
                        ${subject.credits}
                    </td>

                    <td>
                        ${grade}
                    </td>

                    <td>
                        ${gradePoint}
                    </td>

                </tr>

            `;

        }
    );


    section.innerHTML = `

        <div
            class="d-flex justify-content-between
                   align-items-center mb-3"
        >

            <h4 class="fw-bold">

                Semester
                ${semester.semester}

            </h4>


            <div>

                <span class="badge bg-primary me-2">

                    GPA:
                    ${gpa.toFixed(2)}

                </span>


                <span class="badge bg-success">

                    Credits:
                    ${credits}

                </span>

            </div>

        </div>


        <div class="table-responsive">

            <table class="table table-bordered">

                <thead class="table-dark">

                    <tr>

                        <th>#</th>

                        <th>Subject</th>

                        <th>Marks</th>

                        <th>Credits</th>

                        <th>Grade</th>

                        <th>Grade Point</th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>


        <div class="row">

            <div class="col-md-6">

                <strong>
                    Semester GPA:
                </strong>

                ${gpa.toFixed(2)}

            </div>


            <div class="col-md-6">

                <strong>
                    Average Marks:
                </strong>

                ${average.toFixed(2)}

            </div>

        </div>

    `;


    semesterReports.appendChild(
        section
    );

});



// =========================================
// OVERALL INSIGHTS
// =========================================

function generateReportInsights() {

    const container =
        document.getElementById(
            "reportInsights"
        );


    if (allSubjects.length === 0) {

        container.innerHTML = `

            <p class="text-muted">

                No academic results are available.

            </p>

        `;

        return;

    }


    let highest =
        allSubjects[0];


    let lowest =
        allSubjects[0];


    allSubjects.forEach(subject => {

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

    });


    const passed =
        calculatePassedSubjects(
            allSubjects
        );


    const failed =
        allSubjects.length -
        passed;


    let performance;


    if (reportCGPA >= 9) {

        performance =
            "Excellent overall academic performance.";

    }
    else if (reportCGPA >= 8) {

        performance =
            "Very good overall academic performance.";

    }
    else if (reportCGPA >= 7) {

        performance =
            "Good overall academic performance.";

    }
    else if (reportCGPA >= 6) {

        performance =
            "Satisfactory performance with opportunities for improvement.";

    }
    else {

        performance =
            "Overall academic performance needs improvement.";

    }


    container.innerHTML = `

        <div class="row">

            <div class="col-md-6">

                <p>

                    <strong>
                        Highest Performing Subject:
                    </strong>

                    ${highest.name}

                    (${highest.marks} marks)

                </p>


                <p>

                    <strong>
                        Subject Requiring Improvement:
                    </strong>

                    ${lowest.name}

                    (${lowest.marks} marks)

                </p>

            </div>


            <div class="col-md-6">

                <p>

                    <strong>
                        Passed Subjects:
                    </strong>

                    ${passed}

                </p>


                <p>

                    <strong>
                        Failed Subjects:
                    </strong>

                    ${failed}

                </p>

            </div>

        </div>


        <div class="alert alert-info">

            <strong>
                Overall Assessment:
            </strong>

            ${performance}

        </div>

    `;

}


generateReportInsights();



// =========================================
// DOWNLOAD PDF
// =========================================

function downloadPDF() {

    /*
     * Get jsPDF from the global window object.
     */

    const {
        jsPDF
    } = window.jspdf;


    /*
     * Create A4 PDF.
     */

    const doc =
        new jsPDF(
            "p",
            "mm",
            "a4"
        );


    /*
     * Page dimensions.
     */

    const pageWidth =
        doc.internal.pageSize.getWidth();


    const pageHeight =
        doc.internal.pageSize.getHeight();



    // =====================================
    // TITLE
    // =====================================

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(18);


    doc.text(
        "Student Academic Performance Report",
        pageWidth / 2,
        20,
        {
            align: "center"
        }
    );


    doc.setFontSize(10);


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "Student Result & Performance Analytics System",
        pageWidth / 2,
        27,
        {
            align: "center"
        }
    );



    // =====================================
    // STUDENT INFORMATION
    // =====================================

    let y = 40;


    doc.setFontSize(11);


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "Student Information",
        14,
        y
    );


    y += 8;


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "Student Name: " +
        reportStudent.name,
        14,
        y
    );


    doc.text(
        "Student ID: " +
        reportStudent.id,
        110,
        y
    );


    y += 7;


    doc.text(
        "Department: " +
        reportStudent.department,
        14,
        y
    );


    doc.text(
        "Report Date: " +
        new Date().toLocaleDateString(),
        110,
        y
    );


    y += 12;



    // =====================================
    // OVERALL SUMMARY
    // =====================================

    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "Overall Academic Summary",
        14,
        y
    );


    y += 7;


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "CGPA: " +
        reportCGPA.toFixed(2),
        14,
        y
    );


    doc.text(
        "Total Credits: " +
        reportCredits,
        65,
        y
    );


    doc.text(
        "Completed Semesters: " +
        reportSemesters.length,
        120,
        y
    );


    y += 7;


    doc.text(
        "Overall Average Marks: " +
        overallAverage.toFixed(2),
        14,
        y
    );


    y += 12;



    // =====================================
    // SEMESTER TABLES
    // =====================================

    reportSemesters.forEach(
        semester => {

            /*
             * Check whether enough space
             * remains on the page.
             */

            if (y > 240) {

                doc.addPage();

                y = 20;

            }


            const gpa =
                calculateGPA(
                    semester.subjects
                );


            const credits =
                semester.subjects.reduce(

                    (total, subject) => {

                        return total +
                            Number(
                                subject.credits
                            );

                    },

                    0

                );


            const average =
                calculateAverageMarks(
                    semester.subjects
                );


            // Semester heading

            doc.setFont(
                "helvetica",
                "bold"
            );


            doc.setFontSize(12);


            doc.text(
                "Semester " +
                semester.semester,
                14,
                y
            );


            y += 5;


            doc.setFontSize(9);


            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.text(
                "GPA: " +
                gpa.toFixed(2),

                14,
                y
            );


            doc.text(
                "Credits: " +
                credits,

                55,
                y
            );


            doc.text(
                "Average Marks: " +
                average.toFixed(2),

                90,
                y
            );


            y += 3;



            // =================================
            // TABLE
            // =================================

            const tableData =
                semester.subjects.map(
                    (subject, index) => {

                        return [

                            index + 1,

                            subject.name,

                            subject.marks,

                            subject.credits,

                            getGrade(
                                Number(
                                    subject.marks
                                )
                            ),

                            getGradePoint(
                                Number(
                                    subject.marks
                                )
                            )

                        ];

                    }
                );


            doc.autoTable({

                startY: y + 2,

                head: [[

                    "#",

                    "Subject",

                    "Marks",

                    "Credits",

                    "Grade",

                    "Grade Point"

                ]],

                body: tableData,


                theme: "grid",


                styles: {

                    fontSize: 8,

                    cellPadding: 3

                },


                headStyles: {

                    fontStyle: "bold"

                },


                margin: {

                    left: 14,

                    right: 14

                }

            });


            /*
             * Get the position after the table.
             */

            y =
                doc.lastAutoTable.finalY +
                12;

        }
    );



    // =====================================
    // PERFORMANCE SUMMARY
    // =====================================

    if (y > 245) {

        doc.addPage();

        y = 20;

    }


    doc.setFontSize(12);


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.text(
        "Overall Performance Summary",
        14,
        y
    );


    y += 8;


    if (allSubjects.length > 0) {

        let highest =
            allSubjects[0];


        let lowest =
            allSubjects[0];


        allSubjects.forEach(
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
                allSubjects
            );


        const failed =
            allSubjects.length -
            passed;


        let performance;


        if (reportCGPA >= 9) {

            performance =
                "Excellent overall academic performance.";

        }
        else if (reportCGPA >= 8) {

            performance =
                "Very good overall academic performance.";

        }
        else if (reportCGPA >= 7) {

            performance =
                "Good overall academic performance.";

        }
        else if (reportCGPA >= 6) {

            performance =
                "Satisfactory academic performance.";

        }
        else {

            performance =
                "Academic performance needs improvement.";

        }


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(10);


        doc.text(
            "Highest Performing Subject: " +
            highest.name +
            " (" +
            highest.marks +
            " marks)",
            14,
            y
        );


        y += 6;


        doc.text(
            "Subject Requiring Improvement: " +
            lowest.name +
            " (" +
            lowest.marks +
            " marks)",
            14,
            y
        );


        y += 6;


        doc.text(
            "Passed Subjects: " +
            passed,
            14,
            y
        );


        y += 6;


        doc.text(
            "Failed Subjects: " +
            failed,
            14,
            y
        );


        y += 6;


        doc.text(
            "Assessment: " +
            performance,
            14,
            y
        );

    }



    // =====================================
    // FOOTER
    // =====================================

    const totalPages =
        doc.internal.getNumberOfPages();


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        doc.setPage(i);


        doc.setFontSize(8);


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.text(
            "Student Result & Performance Analytics System",
            pageWidth / 2,
            pageHeight - 10,
            {
                align: "center"
            }
        );


        doc.text(
            "Page " +
            i +
            " of " +
            totalPages,

            pageWidth - 15,

            pageHeight - 10,

            {
                align: "right"
            }

        );

    }



    // =====================================
    // SAVE PDF
    // =====================================

    const safeName =
        reportStudent.name
            .replace(
                /[^a-z0-9]/gi,
                "_"
            );


    doc.save(
        safeName +
        "-academic-report.pdf"
    );

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