import React from "react";
import {STRIPE_PUBLISHABLE_KEY} from './config.js';
import {Elements} from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm.js";
import {loadStripe} from "@stripe/stripe-js"

const stripeTestPromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function StripeContainer() {
    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm />
        </Elements>
    )
}