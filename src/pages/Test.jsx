import React from "react";
import { Input } from "@nextui-org/react";

export default function MinimalDebugTest() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Minimal Debug Test</h2>

      {/* Most basic possible test */}
      <div className="space-y-6">
        <Input
          label="Test Outside"
          labelPlacement="outside"
          placeholder="Should have label above"
        />

        <Input
          label="Test Inside"
          labelPlacement="inside"
          placeholder="Should have floating label"
        />

        <Input label="Test Default" placeholder="Default behavior" />
      </div>

      {/* Add inline styles to force override */}
      <div className="mt-8 pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Force Override Test</h3>
        <div
          style={{
            "--heroui-label-placement": "outside",
          }}
        >
          <Input
            label="Force Outside"
            labelPlacement="outside"
            placeholder="Forced with inline styles"
            style={{
              "--label-placement": "outside",
            }}
          />
        </div>
      </div>
    </div>
  );
}
