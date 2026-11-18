
const STORAGE_KEY = "ipl2026Bookings";


// TOAST NOTIFICATION FUNCTION

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

    }, 2500);
}


// GET AND SAVE BOOKINGS

function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}


// BOOKING PAGE LINK NOTIFICATION

document.addEventListener("click", function (event) {

    const bookLink = event.target.closest('a[href*="booking.html"]');

    if (bookLink) {
        sessionStorage.setItem("showBookingToast", "yes");
    }

});


// SMOOTH SCROLLING

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });

});


// BOOKING FORM

const bookingForm = document.getElementById("ticket-booking-form");

if (bookingForm && sessionStorage.getItem("showBookingToast") === "yes") {

    sessionStorage.removeItem("showBookingToast");

    showToast("Opening your IPL ticket booking form!");

    setTimeout(function () {
        bookingForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 300);

}


// HANDLE BOOKING SUBMISSION AND RESET

if (bookingForm) {

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        const preferences = Array.from(
            bookingForm.querySelectorAll(
                'input[name="preferences"]:checked'
            )
        ).map(input => input.value);

        const booking = {

            id: Date.now(),

            name: document.getElementById("name").value.trim(),

            email: document.getElementById("email").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            match: document.getElementById("match").value,

            stand: document.getElementById("stand").value,

            tickets: document.getElementById("tickets").value,

            preferences: preferences,

            bookingDate: new Date().toLocaleDateString()

        };

        const bookings = getBookings();

        bookings.push(booking);

        saveBookings(bookings);

        showToast("Your IPL ticket booking was successful!");

        bookingForm.reset();

        setTimeout(function () {
            window.location.href = "index.html#my-bookings";
        }, 1500);

    });


    // RESET BOOKING SUMMARY

    bookingForm.addEventListener("reset", function () {

        setTimeout(function () {
            updateBookingSummary();
        }, 0);

    });

}


// ACTIVITY 7: LIVE BOOKING SUMMARY

const matchSelect = document.getElementById("match");

const standSelect = document.getElementById("stand");

const ticketQuantity = document.getElementById("tickets");


// SAMPLE TICKET PRICES

const ticketPrices = {

    "General Stand": 800,

    "Premium Stand": 2000,

    "VIP Stand": 5000,

    "Corporate Box": 8000

};


// BOOKING SUMMARY ELEMENTS

const summaryMatch = document.getElementById("summary-match");

const summaryStand = document.getElementById("summary-stand");

const summaryPrice = document.getElementById("summary-price");

const summaryQuantity = document.getElementById("summary-quantity");

const summaryTotal = document.getElementById("summary-total");


// UPDATE BOOKING SUMMARY

function updateBookingSummary() {

    if (
        !matchSelect ||
        !standSelect ||
        !ticketQuantity ||
        !summaryMatch ||
        !summaryStand ||
        !summaryPrice ||
        !summaryQuantity ||
        !summaryTotal
    ) {
        return;
    }

    const selectedMatch = matchSelect.value;

    const selectedStand = standSelect.value;

    const quantity = Number(ticketQuantity.value) || 0;

    const price = ticketPrices[selectedStand] || 0;

    const total = price * quantity;


    // DISPLAY SELECTED DETAILS

    summaryMatch.textContent = selectedMatch || "Not selected";

    summaryStand.textContent = selectedStand || "Not selected";

    summaryPrice.textContent = "₹" + price.toLocaleString("en-IN");

    summaryQuantity.textContent = quantity;

    summaryTotal.textContent = "₹" + total.toLocaleString("en-IN");

}


// LISTEN FOR FORM CHANGES

if (matchSelect && standSelect && ticketQuantity) {

    matchSelect.addEventListener("change", updateBookingSummary);

    standSelect.addEventListener("change", updateBookingSummary);

    ticketQuantity.addEventListener("input", updateBookingSummary);


    // DISPLAY INITIAL SUMMARY

    updateBookingSummary();

}


// MAIN PAGE: DISPLAY SAVED BOOKINGS

const bookingsTable = document.getElementById("bookings-body");

if (bookingsTable) {

    function displayBookings() {

        const bookings = getBookings();

        bookingsTable.replaceChildren();

        if (bookings.length === 0) {

            const row = document.createElement("tr");

            const cell = document.createElement("td");

            cell.colSpan = 6;

            cell.textContent = "No bookings yet. Book your IPL tickets now!";

            cell.style.textAlign = "center";

            row.appendChild(cell);

            bookingsTable.appendChild(row);

            return;
        }


        bookings.forEach(booking => {

            const row = document.createElement("tr");

            const values = [

                booking.name,

                booking.match,

                booking.stand,

                booking.tickets,

                booking.bookingDate,

                booking.preferences && booking.preferences.length
                    ? booking.preferences.join(", ")
                    : "None"

            ];


            values.forEach((value, index) => {

                const cell = document.createElement("td");

                if (index === 5) {

                    cell.classList.add("preferences-cell");

                    const preferenceText = document.createElement("span");

                    preferenceText.textContent = value;

                    const deleteButton = document.createElement("button");

                    deleteButton.type = "button";

                    deleteButton.textContent = "Delete";

                    deleteButton.className = "delete-booking-btn";

                    deleteButton.title = "Delete this booking";


                    // DELETE INDIVIDUAL BOOKING

                    deleteButton.addEventListener("click", function () {

                        const updatedBookings = getBookings().filter(
                            item => item.id !== booking.id
                        );

                        saveBookings(updatedBookings);

                        displayBookings();

                        showToast("Booking deleted successfully!");

                    });


                    cell.appendChild(preferenceText);

                    cell.appendChild(deleteButton);

                } else {

                    cell.textContent = value;

                }

                row.appendChild(cell);

            });

            bookingsTable.appendChild(row);

        });

    }

    displayBookings();

}
