const display = document.getElementById("display");

function press(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    let correctAnswer = eval(display.value);

    // Always make it wrong
    let wrongAnswer = correctAnswer;

    while (wrongAnswer === correctAnswer) {
      wrongAnswer = correctAnswer + Math.floor(Math.random() * 50) + 1;
    }

    display.value = wrongAnswer;
  } catch {
    display.value = "Error";
  }
}
