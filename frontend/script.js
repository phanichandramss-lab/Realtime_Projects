const leaveForm = document.getElementById("leaveForm");
const message = document.getElementById("message");
const leaveTable = document.getElementById("leaveTable");

// Submit a new leave request
leaveForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const leaveData = {
        employee_name: document.getElementById("employee_name").value.trim(),
        leave_type: document.getElementById("leave_type").value,
        start_date: document.getElementById("start_date").value,
        end_date: document.getElementById("end_date").value,
        reason: document.getElementById("reason").value.trim()
    };

    if (leaveData.end_date < leaveData.start_date) {
        message.textContent = "End date cannot be before start date.";
        message.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/leaves", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(leaveData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to submit leave request");
        }

        message.textContent = result.message;
        message.style.color = "green";

        leaveForm.reset();
        await loadLeaveRequests();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});

// Display all leave requests
async function loadLeaveRequests() {
    try {
        const response = await fetch("/leaves");

        if (!response.ok) {
            throw new Error("Unable to load leave requests");
        }

        const leaves = await response.json();

        leaveTable.replaceChildren();

        leaves.forEach(function (leave) {
            const row = document.createElement("tr");

            [
                leave.id,
                leave.employee_name,
                leave.leave_type,
                leave.start_date,
                leave.end_date,
                leave.status
            ].forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            leaveTable.appendChild(row);
        });

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
}

// Load requests when the page opens
loadLeaveRequests();
