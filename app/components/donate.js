"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useState } from "react";

const Donate = ({ setDonate }) => {
  const [amount, setAmount] = useState(10);

  return (
    <div className="w-full bg-white md:w-1/2 lg:w-1/3  px-6 rounded-xl">
      <div className="w-full flex p-6">
        <div className="flex-1"></div>
        <button
          className="rounded-xl text-white font-bold bg-blue-500 hover:bg-blue-600 px-4"
          onClick={() => setDonate(false)}
        >
          close
        </button>
      </div>
      <div className="w-full flex flex-col my-4 px-6">
        <label className="text-black font-bold mx-4 text-md">
          Donate any amount
        </label>
        <input
          className="border-2 rounded-xl w-full px-4 py-2"
          type="number"
          placeholder="donate with love"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="px-6">
        <p>by proceeding to paypal you agree to donate any amount with love.</p>
      </div>
      <div className="mt-7 w-full px-6">
        <PayPalScriptProvider
          options={{
            clientId:
              "AYDFSsgsVVQjnXUWcdEdi621E5M0Ue_JN2vrYwkgE0G9a_r2Mw8ZDBuAuIgPu6wwOBNe7zoGKZ0h6RDF",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical", color: "white" }}
            disabled={false}
            forceReRender={[amount]}
            fundingSource={undefined}
            createOrder={(data, actions) => {
              return actions.order
                .create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: `${amount}`,
                      },
                    },
                  ],
                })
                .then((orderId) => {
                  //Your code here after create the order
                  //setService(amount);
                  return orderId;
                });
            }}
            onApprove={function (data, actions) {
              return actions.order.capture().then(function (event) {
                const paidAmount = event.purchase_units[0].amount.value;
              });
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Donate;
