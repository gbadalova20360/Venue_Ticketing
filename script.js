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

const zoneColors = {
    "VIP": "#C99D30",
    "Premium": "#D66A94",
    "Standard": "#648CF5"
};

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
let selectedSeat = null;
const cart = [];
function getSeatId(seat) {
    return seat.sectionId + "-" + seat.row + "-" + seat.number;
}

function updateSeatElement(seat) {
    const seatElement = document.querySelector(
        '[data-seat-id="' + getSeatId(seat) + '"]'
    );
    if (seatElement) {
        seatElement.classList.remove("available", "selected", "in-cart", "unavailable");
        seatElement.classList.add(seat.status);
    }
}

seats.forEach(seat => {
    if (unavailableSeats.includes(getSeatId(seat))) {
        seat.status = "unavailable";
    }
});

const statusNames = {
    "available": "Available",
    "selected": "Available - selected",
    "in-cart": "In cart",
    "unavailable": "Unavailable"
};

function showSeatDetails(seat) {
    document.getElementById("seat-message").hidden = true;
    document.getElementById("seat-info").hidden = false;
    document.getElementById("seat-section").textContent = seat.section;
    document.getElementById("seat-row").textContent = seat.row;
    document.getElementById("seat-number").textContent = seat.number;
    document.getElementById("seat-price").textContent = seat.price;
    document.getElementById("seat-status").textContent = statusNames[seat.status];

    document.getElementById("add-to-cart").disabled = seat.status !== "selected";
}

function hideSeatDetails() {
    document.getElementById("seat-info").hidden = true;
    document.getElementById("seat-message").hidden = false;
}

function selectSeat(seat) {
    if (selectedSeat !== null && selectedSeat.status === "selected") {
        selectedSeat.status = "available";
        updateSeatElement(selectedSeat);
    }
    selectedSeat = seat;
    if (seat.status === "available") {
        seat.status = "selected";
        updateSeatElement(seat);
    }
    showSeatDetails(seat);
}


function createSeats() {
    sections.forEach(section => {
        const sectionElement = document.createElement("div");
        sectionElement.classList.add("seat-section");
        sectionElement.id = section.id;
        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent =
            section.id.replace("-", " ") +
            " (" + section.name + ")";
        sectionElement.appendChild(sectionTitle);
        const sectionSeats = seats.filter(
            seat => seat.sectionId === section.id
        );
        for (let row = 1; row <= section.rows; row++) {
            const rowElement = document.createElement("div");
            rowElement.classList.add("seat-row");
            const rowSeats = sectionSeats.filter(
                seat => seat.row === row
            );
            rowSeats.forEach((seat, index) => {
                const seatElement = document.createElement("button");
                seatElement.type = "button";
                seatElement.classList.add("seat");
                seatElement.textContent = seat.number;
                seatElement.dataset.seatId = getSeatId(seat);
                seatElement.classList.add(seat.status);
                seatElement.style.setProperty(
                    "--zone-color",
                    zoneColors[seat.section]
                );
                const middle = (rowSeats.length - 1) / 2;
                const offset = middle === 0
                    ? 0
                    : (index - middle) / middle;
                const curve = 12;
                const verticalOffset = curve * offset * offset;
                seatElement.style.transform =
                    `translateY(${verticalOffset}px)`;
                seatElement.setAttribute(
                    "aria-label",
                    seat.section + ", row " + seat.row +
                    ", seat " + seat.number
                );
                seatElement.addEventListener("click", function () {
                    selectSeat(seat);
                });
                rowElement.appendChild(seatElement);
            });
            sectionElement.appendChild(rowElement);
        }
        venueMap.appendChild(sectionElement);
    });
}

function saveCart() {
    const cartData = cart.map(seat => getSeatId(seat));
    localStorage.setItem("venueCart", JSON.stringify(cartData));
}
function loadCart() {
    let savedCart = [];
    try {
        savedCart = JSON.parse(localStorage.getItem("venueCart")) || [];
    } catch (error) {
        savedCart = [];
    }
    savedCart.forEach(seatId => {
        const seat = seats.find(seat => getSeatId(seat) === seatId);
        if (seat && seat.status === "available") {
            seat.status = "in-cart";
            cart.push(seat);
        }
    });
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";
    let total =0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }
    cart.forEach(seat => {
        const item = document.createElement("p");
        item.textContent =
            seat.section + " - Row " + seat.row +
            ", Seat " + seat.number +
            " - " + seat.price + " AZN ";
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";
        removeButton.addEventListener("click", function () {
            cart.splice(cart.indexOf(seat), 1);
            seat.status = "available";
            updateSeatElement(seat);
            saveCart();
            if (selectedSeat === seat) {
                selectedSeat =null;
                hideSeatDetails();
            }
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
    if (selectedSeat ===null) {
        return;
    }
    if (selectedSeat.status !=="selected") {
        return;
    }
    if (cart.includes(selectedSeat)) {
        return;
    }
    cart.push(selectedSeat);
    selectedSeat.status ="in-cart";
    updateSeatElement(selectedSeat);
    saveCart();
    renderCart();
    showSeatDetails(selectedSeat);
});

loadCart();
createSeats();
renderCart();

const viewport = document.getElementById("venue-viewport");
const viewportPadding = 16;
let zoomLevel = 1;
let moveX = 0;
let moveY = 0;

function updateMapView() {
    const mapWidth = venueMap.offsetWidth * zoomLevel;
    const mapHeight = venueMap.offsetHeight * zoomLevel;
    const viewWidth = viewport.clientWidth - viewportPadding * 2;
    const viewHeight = viewport.clientHeight - viewportPadding * 2;
    moveX = Math.max(-mapWidth + 100, Math.min(viewWidth - 100, moveX));
    moveY = Math.max(-mapHeight + 100, Math.min(viewHeight - 100, moveY));
    venueMap.style.transform =
        `translate(${moveX}px, ${moveY}px) scale(${zoomLevel})`;
}

function fitMapToScreen() {
    const viewWidth = viewport.clientWidth - viewportPadding * 2;
    const viewHeight = viewport.clientHeight - viewportPadding * 2;
    const mapWidth = venueMap.offsetWidth;
    const mapHeight = venueMap.offsetHeight;
    zoomLevel = Math.min(viewWidth/mapWidth, viewHeight/mapHeight, 1);
    moveX = (viewWidth - mapWidth * zoomLevel)/2;
    moveY = (viewHeight - mapHeight * zoomLevel)/2;
    updateMapView();
}

function zoomMap(newZoom) {
    const centerX = (viewport.clientWidth - viewportPadding * 2)/2;
    const centerY = (viewport.clientHeight - viewportPadding * 2)/2;
    const ratio = newZoom / zoomLevel;
    moveX = centerX -(centerX - moveX) * ratio;
    moveY = centerY - (centerY - moveY) * ratio;
    zoomLevel = newZoom;
    updateMapView();
}

document.getElementById("zoom-in").addEventListener("click", function () {
    zoomMap(Math.min(zoomLevel+0.1, 2));
});

document.getElementById("zoom-out").addEventListener("click", function () {
    zoomMap(Math.max(zoomLevel-0.1, 0.2));
});

document.getElementById("move-up").addEventListener("click", function () {
    moveY+=30;
    updateMapView();
});

document.getElementById("move-down").addEventListener("click", function () {
    moveY-=30;
    updateMapView();
});

document.getElementById("move-left").addEventListener("click", function () {
    moveX+=30;
    updateMapView();
});

document.getElementById("move-right").addEventListener("click", function () {
    moveX-=30;
    updateMapView();
});

document.getElementById("reset-view").addEventListener("click", function () {
    fitMapToScreen();
});
let lastWidth = window.innerWidth;
window.addEventListener("resize", function () {
    if (window.innerWidth!==lastWidth) {
        lastWidth = window.innerWidth;
        fitMapToScreen();
    }
});
window.addEventListener("load", function () {
    fitMapToScreen();
});