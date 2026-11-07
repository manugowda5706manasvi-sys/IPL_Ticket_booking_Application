
// IPL 2026 Ticket Booking System

const STORAGE_KEY = "ipl2026Bookings";

// Get saved bookings
function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save bookings
function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// BOOKING PAGE: Handle form submission
const bookingForm = document.getElementById("ticket-booking-form");

if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Check HTML5 validation
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

        alert("Your IPL ticket booking has been saved successfully!");

        bookingForm.reset();

        // Return to the main page to view the booking
        window.location.href = "index.html#my-bookings";
    });
}

// MAIN PAGE: Display saved bookings
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
                booking.preferences.length
                    ? booking.preferences.join(", ")
                    : "None"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            bookingsTable.appendChild(row);
        });
    }

    displayBookings();
}
