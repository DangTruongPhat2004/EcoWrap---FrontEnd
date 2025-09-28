import { Button, Input } from "@nextui-org/react";
import { Minus, Plus } from "lucide-react";

export default function QtyStepper({ value, onChange, min = 1, step = 1 }) {
  return (
    <div className="inline-flex items-center rounded-md border border-gray-300 overflow-hidden">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="rounded-none"
        onPress={() => onChange(Math.max(min, value - step))}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <Input
        size="sm"
        value={String(value)}
        onChange={(e) => {
          const v = parseInt(e.target.value || "0", 10);
          if (!Number.isNaN(v)) onChange(Math.max(min, v));
        }}
        classNames={{
          inputWrapper:
            "!rounded-none !border-x !border-gray-300 max-w-[72px] h-9",
          input: "text-center",
        }}
      />
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="rounded-none"
        onPress={() => onChange(value + step)}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
