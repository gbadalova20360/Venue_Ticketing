const sections = [
    {
        id: "front-left",
        name: "Standard",
        price: 15,
        rows: 6,
        seatsPerRow: 10
    },
    {
        id: "front-center",
        name: "VIP",
        price: 35,
        rows: 8,
        seatsPerRow: 10
    },
    {
        id: "front-right",
        name: "Standard",
        price: 15,
        rows: 6,
        seatsPerRow: 10
    },
    {
        id: "back-left",
        name: "Standard",
        price: 15,
        rows: 5,
        seatsPerRow: 8
    },
    {
        id: "back-center",
        name: "Premium",
        price: 25,
        rows: 10,
        seatsPerRow: 10
    },
    {
        id: "back-right",
        name: "Standard",
        price: 15,
        rows: 6,
        seatsPerRow: 10
    }
];

const seats = [];
sections.forEach(section => {
    for (let row = 1; row <= section.rows; row++) {
        for (let seatNumber = 1; seatNumber <= section.seatsPerRow; seatNumber++) {
            seats.push({
                sectionId: section.id,
                section: section.name,
                row: row,
                number: seatNumber,
                price: section.price,
                status: "available"
            });
        }
    }
});


const venueMap = document.getElementById("venue-map");

const unavailableSeats = [
    "front-left-1-1",
    "front-left-2-3",
    "front-center-1-5",
    "back-center-3-7",
    "back-right-2-2"
];
seats.forEach(seat => {
    const seatId =
        seat.sectionId + "-" + seat.row + "-" + seat.number;

    if (unavailableSeats.includes(seatId)) {
        seat.status = "unavailable";
    }
});

let selectedSeat = null;
const cart = [];
function createSeats() {
    sections.forEach(section => {
        const sectionElement = document.createElement("div");
        sectionElement.classList.add("seat-section");
        sectionElement.id = section.id;

        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = section.name;
        sectionElement.appendChild(sectionTitle);

        const sectionSeats = seats.filter(
            seat => seat.sectionId === section.id
        );

        sectionSeats.forEach(seat => {
            const seatElement = document.createElement("button");

            seatElement.type = "button";
            seatElement.classList.add("seat");
            seatElement.textContent = seat.number;

            seatElement.dataset.seatId =
                seat.sectionId + "-" + seat.row + "-" + seat.number;
            seatElement.classList.add(seat.status);

            seatElement.addEventListener("click", function () {
                if (
                    seat.status === "in-cart" ||
                    seat.status === "unavailable"
                ) {
                    return;
                }
                seats.forEach(previousSeat => {
                    if (previousSeat.status === "selected") {
                        previousSeat.status = "available";

                        const previousElement = document.querySelector(
                            '[data-seat-id="' +
                            previousSeat.sectionId + "-" +
                            previousSeat.row + "-" +
                            previousSeat.number + '"]'
                        );

                        if (previousElement) {
                            previousElement.classList.remove("selected");
                            previousElement.classList.add("available");
                        }
                    }
                });
                seat.status = "selected";
                selectedSeat = seat;
                seatElement.classList.remove("available");
                seatElement.classList.add("selected");
                document.getElementById("seat-message").hidden = true;
                document.getElementById("seat-info").hidden = false;

                document.getElementById("seat-section").textContent =
                    seat.section;

                document.getElementById("seat-row").textContent =
                    seat.row;

                document.getElementById("seat-number").textContent =
                    seat.number;

                document.getElementById("seat-price").textContent =
                    seat.price;

                document.getElementById("seat-status").textContent =
                    seat.status;
            });
            sectionElement.appendChild(seatElement);
        });
        venueMap.appendChild(sectionElement);
    });
}

const savedCart = JSON.parse(
    localStorage.getItem("venueCart")
) || [];
savedCart.forEach(seatId => {
    const seat = seats.find(seat => {
        return (
            seat.sectionId + "-" +
            seat.row + "-" +
            seat.number === seatId
        );
    });
    if (seat) {
        seat.status = "in-cart";
        cart.push(seat);
    }
});

createSeats();
renderCart();
function saveCart() {
    const cartData = cart.map(seat => {
        return seat.sectionId + "-" + seat.row + "-" + seat.number;
    });

    localStorage.setItem("venueCart", JSON.stringify(cartData));
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }
    cart.forEach(seat => {
    const item = document.createElement("p");
    item.textContent =
        seat.section + " - Row " + seat.row +
        ", Seat " + seat.number +
        " - " + seat.price + " AZN";

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.type = "button";

    removeButton.addEventListener("click", function () {
        const seatIndex = cart.indexOf(seat);
        cart.splice(seatIndex, 1);
        saveCart();
        seat.status = "available";
        const seatElement = document.querySelector(
            '[data-seat-id="' +
            seat.sectionId + "-" +
            seat.row + "-" +
            seat.number + '"]'
        );

        if (seatElement) {
            seatElement.classList.remove("in-cart");
            seatElement.classList.remove("selected");
            seatElement.classList.add("available");
        }
        if (selectedSeat === seat) {
            selectedSeat = null;
        }
        document.getElementById("seat-info").hidden = true;
        document.getElementById("seat-message").hidden = false;
        renderCart();
    });
    item.appendChild(removeButton);
    cartItems.appendChild(item);
    total += seat.price;
});
    cartTotal.textContent = total.toFixed(2);
}

const addToCartButton = document.getElementById("add-to-cart");

addToCartButton.addEventListener("click", function () {
    if (selectedSeat === null) {
        return;
    }
    if (selectedSeat.status !== "selected") {
        return;
    }
    if (cart.includes(selectedSeat)) {
        return;
    }
    cart.push(selectedSeat);
    selectedSeat.status = "in-cart";
    saveCart();
    const seatElement = document.querySelector(
        '[data-seat-id="' +
        selectedSeat.sectionId + "-" +
        selectedSeat.row + "-" +
        selectedSeat.number + '"]'
    );
    seatElement.classList.remove("selected");
    seatElement.classList.add("in-cart");
    document.getElementById("seat-status").textContent = "in-cart";
    renderCart();
    selectedSeat = null;
});



