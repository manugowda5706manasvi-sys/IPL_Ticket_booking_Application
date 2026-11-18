
const STORAGE_KEY = "ipl2026Bookings";




function showToast(message) {

    const oldToast = document.querySelector(".toast-message");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = "toast-message";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("show");
    }, 10);

    setTimeout(function () {
        toast.classList.remove("show");

        setTimeout(function () {
            toast.remove();
        }, 300);

    }, 3000);
}


/* =========================================
   2. Local Storage Functions
========================================= */

function getBookings() {

    const savedBookings = localStorage.getItem(STORAGE_KEY);

    if (!savedBookings) {
        return [];
    }

    try {
        return JSON.parse(savedBookings);
    } catch (error) {
        return [];
    }
}


function saveBookings(bookings) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bookings)
    );
}


/* =========================================
   3. Smooth Scrolling
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = link.getAttribute("href");

        const targetSection = document.querySelector(targetId);

        if (targetSection) {

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


/* =========================================
   4. Booking Page Link Toast
========================================= */

document.querySelectorAll('a[href*="booking.html"]').forEach(function (link) {

    link.addEventListener("click", function () {

        sessionStorage.setItem("showBookingToast", "true");

    });

});


if (sessionStorage.getItem("showBookingToast") === "true") {

    sessionStorage.removeItem("showBookingToast");

    showToast("You can now book your IPL tickets!");

    setTimeout(function () {

        const bookingForm = document.getElementById("ticket-booking-form");

        if (bookingForm) {

            bookingForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 500);

}


/* =========================================
   5. Booking Form Submission
========================================= */

const bookingForm = document.getElementById("ticket-booking-form");

if (bookingForm) {

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!bookingForm.checkValidity()) {

            bookingForm.reportValidity();

            showToast("Please complete all required fields.");

            return;
        }


        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const match = document.getElementById("match").value;

        const stand = document.getElementById("stand").value;

        const tickets = Number(document.getElementById("tickets").value);


        const selectedPreferences = [];

        document.querySelectorAll('input[name="preferences"]:checked').forEach(function (checkbox) {

            selectedPreferences.push(checkbox.value);

        });


        const booking = {

            id: Date.now(),

            name: name,

            email: email,

            phone: phone,

            match: match,

            stand: stand,

            tickets: tickets,

            preferences: selectedPreferences,

            bookingDate: new Date().toLocaleDateString("en-IN")

        };


        const bookings = getBookings();

        bookings.push(booking);

        saveBookings(bookings);


        showToast("Your IPL ticket booking was successful!");


        bookingForm.reset();

        updateBookingSummary();


        setTimeout(function () {

            window.location.href = "index.html#my-bookings";

        }, 1200);

    });


    /* Reset Booking Summary */
    bookingForm.addEventListener("reset", function () {

        setTimeout(function () {

            updateBookingSummary();

        }, 0);

    });

}


/* =========================================
   6. Activity 7 - Live Booking Summary
========================================= */

const ticketPrices = {

    "General Stand": 800,

    "Premium Stand": 2000,

    "VIP Stand": 5000,

    "Corporate Box": 8000

};


function updateBookingSummary() {

    const matchInput = document.getElementById("match");

    const standInput = document.getElementById("stand");

    const ticketsInput = document.getElementById("tickets");


    if (!matchInput || !standInput || !ticketsInput) {
        return;
    }


    const selectedMatch = matchInput.options[matchInput.selectedIndex];

    const matchName = selectedMatch ? selectedMatch.text : "Not selected";

    const selectedStand = standInput.value || "Not selected";

    const quantity = Number(ticketsInput.value) || 0;


    let price = ticketPrices[selectedStand] || 0;

    let total = price * quantity;


    const summaryMatch = document.getElementById("summary-match");

    const summaryStand = document.getElementById("summary-stand");

    const summaryPrice = document.getElementById("summary-price");

    const summaryQuantity = document.getElementById("summary-quantity");

    const summaryTotal = document.getElementById("summary-total");


    if (summaryMatch) {
        summaryMatch.textContent = matchName;
    }

    if (summaryStand) {
        summaryStand.textContent = selectedStand;
    }

    if (summaryPrice) {
        summaryPrice.textContent = "₹" + price;
    }

    if (summaryQuantity) {
        summaryQuantity.textContent = quantity;
    }

    if (summaryTotal) {
        summaryTotal.textContent = "₹" + total;
    }

}


/* Live Summary Event Listeners */

const matchInput = document.getElementById("match");

const standInput = document.getElementById("stand");

const ticketsInput = document.getElementById("tickets");


if (matchInput) {
    matchInput.addEventListener("change", updateBookingSummary);
}

if (standInput) {
    standInput.addEventListener("change", updateBookingSummary);
}

if (ticketsInput) {
    ticketsInput.addEventListener("input", updateBookingSummary);
}


/* Display Summary When Booking Page Loads */

updateBookingSummary();


/* =========================================
   7. Display Saved Bookings
========================================= */

const bookingsTable = document.getElementById("bookings-body");


if (bookingsTable) {

    function displayBookings() {

        const bookings = getBookings();

        bookingsTable.innerHTML = "";


        if (bookings.length === 0) {

            const emptyRow = document.createElement("tr");

            const emptyCell = document.createElement("td");

            emptyCell.colSpan = 6;

            emptyCell.textContent = "No bookings available yet.";

            emptyCell.className = "empty-bookings";

            emptyRow.appendChild(emptyCell);

            bookingsTable.appendChild(emptyRow);

            return;

        }


        bookings.forEach(function (booking) {

            const row = document.createElement("tr");


            const nameCell = document.createElement("td");

            nameCell.textContent = booking.name;


            const matchCell = document.createElement("td");

            matchCell.textContent = booking.match;


            const standCell = document.createElement("td");

            standCell.textContent = booking.stand;


            const ticketsCell = document.createElement("td");

            ticketsCell.textContent = booking.tickets;


            const dateCell = document.createElement("td");

            dateCell.textContent = booking.bookingDate || "Not available";


            const preferencesCell = document.createElement("td");

            preferencesCell.className = "preferences-cell";


            const preferencesText = document.createElement("span");

            preferencesText.textContent =
                booking.preferences && booking.preferences.length > 0
                    ? booking.preferences.join(", ")
                    : "None";


            const deleteButton = document.createElement("button");

            deleteButton.type = "button";

            deleteButton.textContent = "delete";

            deleteButton.className = "delete-booking-btn";

            deleteButton.setAttribute("aria-label", "Delete booking");


            deleteButton.addEventListener("click", function () {

                deleteBooking(booking.id);

            });


            preferencesCell.appendChild(preferencesText);

            preferencesCell.appendChild(deleteButton);


            row.appendChild(nameCell);

            row.appendChild(matchCell);

            row.appendChild(standCell);

            row.appendChild(ticketsCell);

            row.appendChild(dateCell);

            row.appendChild(preferencesCell);


            bookingsTable.appendChild(row);

        });

    }


    /* Delete Booking */
    function deleteBooking(bookingId) {

        const bookings = getBookings();

        const updatedBookings = bookings.filter(function (booking) {

            return booking.id !== bookingId;

        });


        saveBookings(updatedBookings);

        displayBookings();

        showToast("Booking deleted successfully.");

    }


    displayBookings();

}


/* =========================================
   8. Activity 8 - Mobile Hamburger Menu
========================================= */

const menuToggle = document.getElementById("menu-toggle");

const navLinks = document.getElementById("nav-links");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");


        const isOpen = navLinks.classList.contains("active");


        menuToggle.textContent = isOpen ? "✕" : "☰";

        menuToggle.setAttribute("aria-expanded", isOpen);

    });


    /* Close Menu After Clicking a Link */
    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuToggle.textContent = "☰";

            menuToggle.setAttribute("aria-expanded", "false");

        });

    });

}


/* =========================================
   9. Activity 8 - Team Filter
========================================= */

const teamFilter = document.getElementById("team-filter");

const matchCards = document.querySelectorAll(".match-card");


if (teamFilter) {

    teamFilter.addEventListener("change", function () {

        const selectedTeam = teamFilter.value;


        matchCards.forEach(function (card) {

            const teams = card.dataset.teams.split(" ");


            if (selectedTeam === "all" || teams.includes(selectedTeam)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}


/* =========================================
   10. Activity 8 - Grid and List View
========================================= */

const matchGrid = document.getElementById("match-grid");

const gridViewButton = document.getElementById("grid-view");

const listViewButton = document.getElementById("list-view");


if (matchGrid && gridViewButton && listViewButton) {


    /* Grid View Button */
    gridViewButton.addEventListener("click", function () {

        matchGrid.classList.remove("list-view");

        gridViewButton.classList.add("active");

        listViewButton.classList.remove("active");

    });


    /* List View Button */
    listViewButton.addEventListener("click", function () {

        matchGrid.classList.add("list-view");

        listViewButton.classList.add("active");

        gridViewButton.classList.remove("active");

    });

}