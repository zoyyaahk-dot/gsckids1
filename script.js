/* =========================================================
   GLOBAL KIDS - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");

if (menuButton && navbar) {

    menuButton.addEventListener("click", function () {

        navbar.classList.toggle("mobile-menu");

    });

}


/* =========================================================
   CLOSE MOBILE MENU WHEN LINK IS CLICKED
   ========================================================= */

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navbar) {
            navbar.classList.remove("mobile-menu");
        }

    });

});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(function (link) {

    const linkPage = link.getAttribute("href");

    if (
        linkPage === currentPage &&
        !linkPage.includes("#")
    ) {
        link.classList.add("active");
    }

});


/* =========================================================
   SCROLL EFFECT
   ========================================================= */

window.addEventListener("scroll", function () {

    const header = document.querySelector(".header");

    if (!header) return;

    if (window.scrollY > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* =========================================================
   SIMPLE FADE-IN ANIMATION
   ========================================================= */

const animatedElements = document.querySelectorAll(
    ".feature-card, .facility-card, .portal-card, .vision-card, .campus-feature-card"
);

const observer = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.15
    }
);


animatedElements.forEach(function (element) {

    observer.observe(element);

});


/* =========================================================
   CURRENT YEAR
   ========================================================= */

const yearElements = document.querySelectorAll(".current-year");

yearElements.forEach(function (element) {

    element.textContent = new Date().getFullYear();

});


/* =========================================================
   LOGIN MODULE CLICK
   ========================================================= */

const loginModules = document.querySelectorAll(".login-module");

loginModules.forEach(function (module) {

    module.addEventListener("click", function () {

        console.log(
            "Opening:",
            module.querySelector("h2")?.textContent
        );

    });

});
/* =========================================================
   TEACHER DASHBOARD
   ========================================================= */

const demoStudents = [
    {
        roll: 1,
        name: "Aarav Kumar",
        parent: "Parent 1"
    },
    {
        roll: 2,
        name: "Aanya Sharma",
        parent: "Parent 2"
    },
    {
        roll: 3,
        name: "Rayan Ahmed",
        parent: "Parent 3"
    },
    {
        roll: 4,
        name: "Sara Khan",
        parent: "Parent 4"
    },
    {
        roll: 5,
        name: "Vihaan Rao",
        parent: "Parent 5"
    }
];


function loadClass() {

    const classSelect =
        document.getElementById("classSelect");

    const sectionSelect =
        document.getElementById("sectionSelect");

    const tableBody =
        document.getElementById("studentTableBody");

    if (!classSelect || !sectionSelect || !tableBody) {
        return;
    }

    const selectedClass = classSelect.value;
    const selectedSection = sectionSelect.value;

    if (!selectedClass || !selectedSection) {

        alert("Please select both Class and Section.");

        return;
    }


    tableBody.innerHTML = "";


    demoStudents.forEach(function(student) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${student.roll}
            </td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>

                <label>
                    <input
                        type="radio"
                        name="attendance-${student.roll}"
                        value="present"
                        checked
                        onchange="updateAttendanceStatus(${student.roll}, 'Present')"
                    >
                    Present
                </label>

                &nbsp;&nbsp;

                <label>
                    <input
                        type="radio"
                        name="attendance-${student.roll}"
                        value="absent"
                        onchange="updateAttendanceStatus(${student.roll}, 'Absent')"
                    >
                    Absent
                </label>

            </td>

            <td>

                <span
                    id="status-${student.roll}"
                    class="attendance-status status-present">

                    Present

                </span>

            </td>

        `;

        tableBody.appendChild(row);

    });


    updateDashboardStats();

    populateIssueStudents();

}


function updateAttendanceStatus(roll, status) {

    const statusElement =
        document.getElementById(`status-${roll}`);

    if (!statusElement) {
        return;
    }

    statusElement.textContent = status;

    statusElement.className =
        status === "Present"
            ? "attendance-status status-present"
            : "attendance-status status-absent";

    updateDashboardStats();

}


function updateDashboardStats() {

    const total =
        document.querySelectorAll(
            ".attendance-table tbody tr"
        ).length;


    if (total === 0) {
        return;
    }


    let present = 0;
    let absent = 0;


    for (let i = 1; i <= total; i++) {

        const selected =
            document.querySelector(
                `input[name="attendance-${i}"]:checked`
            );

        if (selected) {

            if (selected.value === "present") {
                present++;
            }

            if (selected.value === "absent") {
                absent++;
            }

        }

    }


    const percentage =
        total > 0
            ? Math.round((present / total) * 100)
            : 0;


    document.getElementById(
        "totalStudents"
    ).textContent = total;


    document.getElementById(
        "presentStudents"
    ).textContent = present;


    document.getElementById(
        "absentStudents"
    ).textContent = absent;


    document.getElementById(
        "attendancePercentage"
    ).textContent = percentage + "%";

}


function saveAttendance() {

    const tableBody =
        document.getElementById("studentTableBody");

    if (!tableBody) {
        return;
    }

    const rows =
        tableBody.querySelectorAll("tr");

    if (rows.length === 0 ||
        rows[0].querySelector(".empty-table")) {

        alert("Please load a class first.");

        return;
    }


    const message =
        document.getElementById("attendanceMessage");

    message.textContent =
        "Attendance saved successfully for today's class.";

    message.style.display = "block";


    setTimeout(function() {

        message.style.display = "none";

    }, 4000);

}


function populateIssueStudents() {

    const select =
        document.getElementById("issueStudent");

    if (!select) {
        return;
    }


    select.innerHTML =
        "<option>Select Student</option>";


    demoStudents.forEach(function(student) {

        const option =
            document.createElement("option");

        option.value = student.roll;

        option.textContent =
            student.roll + " - " + student.name;

        select.appendChild(option);

    });

}


function openIssueModal() {

    const modal =
        document.getElementById("issueModal");

    if (!modal) {
        return;
    }

    populateIssueStudents();

    modal.classList.add("show");

}


function closeIssueModal() {

    const modal =
        document.getElementById("issueModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

}


function submitIssue() {

    const student =
        document.getElementById("issueStudent").value;

    const description =
        document.getElementById(
            "issueDescription"
        ).value.trim();

    const message =
        document.getElementById("issueMessage");


    if (
        !student ||
        student === "Select Student"
    ) {

        message.textContent =
            "Please select a student.";

        message.style.color = "#d94f79";

        return;

    }


    if (!description) {

        message.textContent =
            "Please describe the issue.";

        message.style.color = "#d94f79";

        return;

    }


    message.textContent =
        "Issue submitted. It will be processed according to the school's approval workflow.";

    message.style.color = "#398457";


    document.getElementById(
        "issueDescription"
    ).value = "";


    setTimeout(function() {

        closeIssueModal();

    }, 2500);

}


function showStudentDetails() {

    alert(
        "Student details will appear here after the school database is connected."
    );

}


function showParentDetails() {

    alert(
        "Registered parent information will appear here after the school database is connected."
    );

}


function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {

        window.location.href =
            "login.html";

    }

}


/* TODAY'S DATE */

const todayDate =
    document.getElementById("todayDate");

if (todayDate) {

    const today = new Date();

    todayDate.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}