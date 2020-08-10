import { makeSeatSelection, selectDefaultSelection, computeAdjacentSeats } from "../utils/seatSelection";

export const renderSeats = (rowData, seatGroup) => {

    let tempHtml = '';
    seatGroup.forEach(group => {
        const { name, label, startRow, endRow, price } = group;
        let groupHtml = (`
        <div id="group-container">
            <div class="group-title">${label.toUpperCase()} - Rs. ${price}.00</div>
            <div>${getRows(group, rowData)}</div>
        </div>
    `);
        tempHtml += groupHtml;
    });
    return tempHtml;
}

export const renderSeatSelector = () => {
    return (`
    <div class="seat-selector-container">
        <div class="seat-selector-row">
            <label>Please choose your seating group:</label>
            <select id="seatGroup">
                <option value="club" selected>CLUB</option>
                <option value="executive">EXECUTIVE</option>
            </select>
        </div>
        <div class="seat-selector-row">
            <label>Please enter the number of persons: </label>
            <input id="numOfPersons" type="number" min="1" max="10" value="1"/>
        </div>
    </div>
    `);
}

export const renderErrorBlock = (error) => {
    const className = `error-block ${error ? "" : "hidden"}`;
    return (`
        <div class="${className}">${error}</div>
    `);
}

export const toggleError = (error) => {
    let errorComp = document.getElementsByClassName("error-block")[0]
    errorComp.innerHTML = error;
    if (error) {
        errorComp.classList.remove("hidden");
    } else {
        errorComp.classList.add("hidden");
    }
}

export const disableEnableHall = (error) => {
    let hall = document.getElementById("hall-container");
    if (error) {
        hall.classList.add("disabled-hall");
    } else {
        hall.classList.remove("disabled-hall");
    }
}

export const highLightSelectedSeats = (metaData) => {
    const { seatSelection, rowData, seatGroup, occupiedSeats } = metaData;
    selectDefaultSelection(occupiedSeats, rowData);
    seatSelection.forEach(currentSeat => {
        const { row, seat } = currentSeat;
        rowData[row.value - 1].seats[seat.value - 1].userSelection = true;
    });
    let html = renderSeats(rowData, seatGroup);
    let container = document.getElementById("hall-container");
    container.innerHTML = html;
}

export const showSelectedSeats = (metaData) => {
    const { pageError, seatSelection, rowData, seatGroup, occupiedSeats, selectedNumber, error } = metaData;
    toggleError(pageError);
    disableEnableHall(pageError);
    selectDefaultSelection(occupiedSeats, rowData);
    highLightSelectedSeats({ seatSelection, rowData, seatGroup, occupiedSeats });
    calculateAndUpdatePricing(rowData, seatSelection, selectedNumber, pageError);
}

export const calculateAndUpdatePricing = (rowData, selectedSeats, selectedNumber, pageError) => {
    let price = 0;
    selectedSeats.forEach(seatConfig => {
        const { row, seat } = seatConfig;
        price += rowData[row.value - 1].seats[seat.value - 1].price;
    });

    const html = (`
        <div><span>Total Price: </span> <span style="width: 120px;display: inline-block;">Rs. ${price}.00</span></div>
        <button type="button" ${(selectedNumber != selectedSeats.length || pageError) ? "disabled" : ""}> Continue to Payment </button>
    `);
    let dom = document.getElementById("price-container");
    dom.innerHTML = html;
}

function getRows(group, rowData) {
    const { startRow, endRow } = group;
    let rowArr = [];
    for (let i = startRow; i <= endRow; i++) {
        let currentRow = rowData[i - 1];
        let html = `<div id="row-container" data-row-id=${currentRow.value}>${getRowDOM(currentRow, group)}</div>`
        rowArr.push(html);
    }
    return rowArr.join('');
}

function getRowDOM(currentRow, group) {
    const { label, value } = currentRow;
    let html = (`
    <div>
        <div class="row-label">${label}</div>
        <div class="row-seats">${getSeatsDOM(currentRow, group)}</div>
    </div>
`);
    return html;
}

function getSeatsDOM(currentRow, group) {
    const { seats } = currentRow;
    let seatArr = [];
    for (let i = 0; i < seats.length; i++) {
        let currentSeat = seats[i];
        const { label, value, vacant, exists, userSelection } = currentSeat;
        let seatClass = `seat ${exists ? "" : "hide"} ${vacant ? "" : "occuppied "} ${userSelection ? "user-selection" : ""}`;
        let seatHTML = "";
        if (currentSeat.specialPrice) {
            seatHTML = (`
            <div class="${seatClass} tooltip" data-groupname=${group.name} data-seatId=${currentRow.value + "-" + value} name="seat">${label}
                <span class="tooltiptext">${currentSeat.tooltipText}</span>
            </div>
            `);
        } else {
            seatHTML = (`<div class = "${seatClass}" data-groupname=${group.name} data-seatId=${currentRow.value + "-" + value} name="seat">${label}</div>`);
        }
        seatArr.push(seatHTML);
    }
    return seatArr.join("");
}