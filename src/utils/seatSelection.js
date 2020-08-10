export const makeSeatSelection = (globalValues, seatGroup, rowData) => {
    const { selectedGroup, selectedNumber, selectedSeats } = globalValues;

    let startRow, endRow;
    let tempSelectedSeats = [];
    seatGroup.forEach(group => {
        if (selectedGroup === group.name) {
            startRow = group.startRow;
            endRow = group.endRow;
        }
    });

    let counter = selectedNumber;

    for (let i = startRow; i <= endRow; i++) {
        let currentRow = rowData[i - 1];

        for (let j = 0; j < currentRow.seats.length; j++) {
            let seat = currentRow.seats[j];
            if (seat.exists) {
                if (seat.vacant) {
                    tempSelectedSeats.push({ row: currentRow, seat: seat });
                    counter--;
                } else {
                    tempSelectedSeats = [];
                    counter = selectedNumber;
                }
            }
            if (!counter) {
                return tempSelectedSeats;
            }
        }
        tempSelectedSeats = [];
        counter = selectedNumber;
    }

    return tempSelectedSeats;
};

export const selectDefaultSelection = (occupiedSeats, rowData) => {
    Object.keys(occupiedSeats).forEach(row => {
        let seats = rowData[row - 1].seats;
        let occupied = occupiedSeats[row];
        occupied.forEach(seat => {
            seats[seat - 1].vacant = false;
        })
    });

    rowData.forEach(row => {
        row.seats.forEach(seat => seat.userSelection = false);
    })
};

export const computeAdjacentSeats = (rowData, selection, selectedNumber) => {
    const { row, seat } = selection;
    const currentRow = rowData[row.value - 1];
    const currentSeat = seat.value - 1;
    let counter = selectedNumber - 1;
    let tempSeats = [selection];
    for (let i = seat.value; i < currentRow.seats.length; i++) {
        let currSeat = currentRow.seats[i];
        if (currSeat.exists && currSeat.vacant) {
            if (counter) {
                counter--;
                tempSeats.push({ row: currentRow, seat: currSeat });
            } else {
                return tempSeats;
            }
        } else {
            break;
        }
    }
    if (!counter) {
        return tempSeats;
    }

    counter = selectedNumber - 1;
    tempSeats = [selection];

    for (let i = seat.value - 2; i >= 0; i--) {
        let currSeat = currentRow.seats[i];
        if (currSeat.exists && currSeat.vacant) {
            if (counter) {
                counter--;
                tempSeats.push({ row: currentRow, seat: currSeat });
            } else {
                return tempSeats;
            }
        } else {
            break;
        }
    }

    if (!counter) {
        return tempSeats;
    } else {
        return [selection];
    }
}