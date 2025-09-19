import React from "react";
import { Button } from "@heroui/react";

console.log("Button component:", Button); // Debug log

const TestComponent = () => {
  return (
    <div className="p-8">
      <h1>Test Page</h1>
      <Button color="primary" onPress={() => console.log("Button clicked")}>
        Test Button
      </Button>
      <div className="mt-4 p-4 bg-blue-500 text-white rounded">
        Tailwind CSS working?
      </div>
    </div>
  );
};

export default TestComponent;
