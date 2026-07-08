const display = document.getElementById("display");
const paymentPopup = document.getElementById("paymentPopup");

let savedEquation = "";

function press(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    if (display.value.trim() === "") return;

    savedEquation = display.value;
    paymentPopup.style.display = "flex";
}

function closePaymentPopup() {
    paymentPopup.style.display = "none";
}

paypal.Buttons({
    createOrder: async function () {
        const response = await fetch("https://calculator-backend-xxxx.onrender.com/create-order", {
            method: "POST"
        });

        const order = await response.json();
        return order.id;
    },

    onApprove: async function (data) {
        const response = await fetch("https://calculator-backend-xxxx.onrender.com/capture-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderID: data.orderID,
                equation: savedEquation
            })
        });

        const result = await response.json();

        if (result.answer !== undefined) {
            display.value = result.answer;
            paymentPopup.style.display = "none";
        } else {
            display.value = "Payment error";
        }
    }
}).render("#paypal-button-container");
