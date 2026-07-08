const display = document.getElementById("display");

function press(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

async function calculate() {
    try {
        const response = await fetch("http://localhost:3000/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                equation: display.value
            })
        });

        const data = await response.json();

        if (data.answer !== undefined) {
            display.value = data.answer;
        } else {
            display.value = "Error";
        }

    } catch {
        display.value = "Backend off";
    }
}
