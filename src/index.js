import { seatGroup, rowData } from "./metaData";
import {
    renderSeatSelector, renderErrorBlock, renderSeats,
    showSelectedSeats, calculateAndUpdatePricing, toggleError
} from "./utils";
import { eventSubscriber } from "./eventListeners";
import { makeSeatSelection, selectDefaultSelection, computeAdjacentSeats } from "./utils/seatSelection";

import "./styles.css";

let pageError = "";
const global = {
    selectedGroup: "club",
    selectedNumber: 1,
    selectedSeats: []
};

const onSeatGroupChange = (event) => {
    global.selectedGroup = event.target.value;
    let seatSelection = makeSeatSelection(global, seatGroup, rowData);
    global.selectedSeats = seatSelection;
    showSelectedSeats({ pageError, seatSelection, rowData, seatGroup, occupiedSeats, selectedNumber: global.selectedNumber });
}

const onPersonsChange = (event) => {
    const value = +event.target.value;
    let seatSelection = [];
    if (value < 1 || value > 10) {
        pageError = "Please enter persons count between 1 and 10";
    } else {
        pageError = "";
        global.selectedNumber = value;
        seatSelection = makeSeatSelection(global, seatGroup, rowData);
        global.selectedSeats = seatSelection;
    }
    showSelectedSeats({ pageError, seatSelection, rowData, seatGroup, occupiedSeats, selectedNumber: global.selectedNumber });
}

const onSeatClicked = (event) => {
    if (!event.target.attributes.name || event.target.attributes.name.value != "seat") {
        return;
    }
    let clickedGroup = event.target.dataset.groupname;
    if (clickedGroup != global.selectedGroup) {
        toggleError("Please select seats from same group or select a different group");
        return;
    }
    let seatid = event.target.dataset.seatid.split("-");
    let row = rowData[seatid[0] - 1];
    let seat = row.seats[seatid[1] - 1];
    let seatSelection = global.selectedSeats;

    if (global.selectedNumber > global.selectedSeats.length) {
        seatSelection.push({ row, seat });
    } else {
        seatSelection = { row, seat };
        seatSelection = computeAdjacentSeats(rowData, seatSelection, global.selectedNumber);
    }
    global.selectedSeats = seatSelection;
    showSelectedSeats({ pageError, seatSelection, rowData, seatGroup, occupiedSeats, selectedNumber: global.selectedNumber });
}

//hardcoding occupied seats
localStorage.setItem("occupiedSeats", JSON.stringify({"1":[1,3,5,9],"2":[3,4,5,6],"3":[7,8,9,10,11,12,13,14,15],"4":[7,8,9,10,11,12,13,14,15],"5":[12,13,14,15],"6":[],"7":[],"8":[],"9":[],"10":[]}))


//fetch occupied seats from localstorage
let occupiedSeats = localStorage.getItem("occupiedSeats");
occupiedSeats = JSON.parse(occupiedSeats);

//mark seats as occupied
selectDefaultSelection(occupiedSeats, rowData);

//create page html
const pageHTML = (`
    <div>
        ${renderSeatSelector()}
        ${renderErrorBlock(pageError)}
        <div id="hall-container">${renderSeats(rowData, seatGroup)}</div>
    </div>
`);

//render page html
document.getElementById("app").innerHTML = pageHTML;

//subscribe to events
const subscriberCallbacks = {
    onSeatGroupChange, onPersonsChange, onSeatClicked
};
eventSubscriber(subscriberCallbacks);

//autoselect the seats
let seatSelection = makeSeatSelection(global, seatGroup, rowData);
global.selectedSeats = seatSelection;
showSelectedSeats({ pageError, seatSelection, rowData, seatGroup, occupiedSeats });

//calculate and display pricing
calculateAndUpdatePricing(rowData, global.selectedSeats, global.selectedNumber, pageError);