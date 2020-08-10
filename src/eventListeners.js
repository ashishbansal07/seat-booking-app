export const eventSubscriber = (eventCallbacks) => {
    const { onSeatGroupChange, onPersonsChange, onSeatClicked } = eventCallbacks;

    window.addEventListener("load", () => {
        const numOfPersons = document.getElementById("numOfPersons");
        numOfPersons.addEventListener("change", (event) => onPersonsChange(event));

        const seatGroup = document.getElementById("seatGroup");
        seatGroup.addEventListener("change", (event) => onSeatGroupChange(event));

        const hallContainer = document.getElementById("hall-container");
        hallContainer.addEventListener("click", (event) => onSeatClicked(event));

    }, false);
};


