import React from "react";
import AddressForm from "../components/checkout/AddressForm";
import ShippingMethodSelector from "../components/checkout/ShippingMethodSelector";
import useShippingFee from "../components/checkout/hooks/useShippingFee";
import SummaryCard from "../components/cart/SummaryCard";

export default function CheckoutShippingSection() {
  const [address, setAddress] = React.useState({ city: "HCM" });
  const [method, setMethod] = React.useState("standard");

  const items = [{ id: "bag", price: 2000, qty: 100 }];
  const region = address.city || "HCM";

  const { fee, eta } = useShippingFee({ method, region });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <AddressForm value={address} onChange={setAddress} />
        <ShippingMethodSelector
          value={method}
          onChange={setMethod}
          region={region}
        />
      </div>

      <div>
        <SummaryCard
          items={items}
          extraFees={
            fee ? [{ label: `Phí giao hàng (${eta})`, amount: fee }] : []
          }
        />
      </div>
    </div>
  );
}
