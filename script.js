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
function createSeats() {
    sections.forEach(section => {
        const sectionElement = document.createElement("div");
        sectionElement.classList.add("seat-section");
        sectionElement.id = section.id;

        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = section.name;
        sectionElement.appendChild(sectionTitle);

        const sectionSeats = seats.filter(
            seat => seat.section === section.name
        );

        sectionSeats.forEach(seat => {
            const seatElement = document.createElement("button");
            seatElement.classList.add("seat");
            seatElement.textContent = seat.number;
            seatElement.classList.add(seat.status);

            sectionElement.appendChild(seatElement);
        });

        venueMap.appendChild(sectionElement);
    });
}

createSeats();


