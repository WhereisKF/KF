const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

async function getPayPalAccessToken() {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token;
}

app.post("/create-order", async (req, res) => {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "GBP",
                    value: "0.10"
                },
                description: "Wrong Calculator answer"
            }]
        })
    });

    const data = await response.json();
    res.json(data);
});

app.post("/capture-order", async (req, res) => {
    const { orderID, equation } = req.body;
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
        `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        }
    );

    const paymentData = await response.json();

    if (paymentData.status !== "COMPLETED") {
        return res.status(400).json({ error: "Payment not completed" });
    }

    let correctAnswer = eval(equation);
    let wrongAnswer = correctAnswer;

    while (wrongAnswer === correctAnswer) {
        wrongAnswer = correctAnswer + Math.floor(Math.random() * 50) + 1;
    }

    res.json({ answer: wrongAnswer });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});