const sections=[
    {
        name:"VIP",
        price:35,
        rows:6,
        seatsperRow:12
    },
    {
        name:"Premium",
        price:25,
        rows:8,
        seatsperRow:16
    },
    {
        name:"Standard",
        price:15,
        rows:10,
        seatsperRow:20
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


