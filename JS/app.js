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

    }, 2500);
}




function getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}



document.addEventListener("click", function (event) {

    const bookLink = event.target.closest('a[href*="booking.html"]');

    if (bookLink) {
        sessionStorage.setItem("showBookingToast", "yes");
    }

});




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

}




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

                    // Preferences and tiny Delete button in same cell
                    cell.classList.add("preferences-cell");

                    const preferenceText = document.createElement("span");

                    preferenceText.textContent = value;

                    const deleteButton = document.createElement("button");

                    deleteButton.type = "button";

                    deleteButton.textContent = "Delete";

                    deleteButton.className = "delete-booking-btn";

                    deleteButton.title = "Delete this booking";


                    
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
