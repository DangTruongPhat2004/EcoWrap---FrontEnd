import { Button, Chip } from "@nextui-org/react";
import { Trash2, Leaf } from "lucide-react";
import QtyStepper from "./QtyStepper";
import { fmtVND } from "../../utils/money";

export default function CartItemRow({ item, onQty, onRemove }) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-4">
      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-[#8B6F47] truncate">{item.name}</div>
          <div className="text-sm text-gray-500 truncate">{item.variant}</div>
          <div className="mt-1 pdx-1 inline-block">
            <Chip size="sm" variant="flat" className=" text-emerald-700">
              <Leaf className="w-3 h-3 mr-1" /> 100% thân thiện với môi trường
            </Chip>
          </div>
        </div>
      </div>

      <div className="col-span-4 md:col-span-2 text-gray-700">
        {fmtVND(item.price)}
      </div>

      <div className="col-span-5 md:col-span-2">
        <QtyStepper value={item.qty} onChange={(q) => onQty(item.id, q)} />
      </div>

      <div className="col-span-3 md:col-span-2 flex items-center justify-between md:justify-end gap-3">
        <div className="font-semibold text-gray-900">
          {fmtVND(item.price * item.qty)}
        </div>
        <Button isIconOnly variant="light" onPress={() => onRemove(item.id)}>
          <Trash2 className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
