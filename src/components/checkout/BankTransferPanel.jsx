import React from "react";
import { Card, CardBody, Button, Tooltip } from "@nextui-org/react";

function formatVND(n) {
  if (typeof n !== "number") return "";
  return n.toLocaleString("vi-VN") + " ₫";
}

function toUrlParam(s = "") {
  return encodeURIComponent(String(s)).replace(/%20/g, "+");
}

function CopyBtn({ text, label }) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <Tooltip
      content={copied ? "Đã copy!" : "Sao chép"}
      isOpen={copied}
      closeDelay={200}
      placement="top"
    >
      <Button size="sm" variant="flat" onPress={onCopy}>
        {label}
      </Button>
    </Tooltip>
  );
}

/**
 * BankTransferPanel
 * Props:
 * - bankCode: string (VD: "VCB", "TCB", "MBB")
 * - accountNumber: string
 * - accountName: string
 * - amount: number (VND)
 * - transferNote: string (nội dung bắt buộc theo đơn)
 * - expiresAt?: Date|string (ISO)
 * - onIHavePaid?: () => void
 *
 */
export default function BankTransferPanel({
  bankCode = "VCB",
  accountNumber = "123456789",
  accountName = "CONG TY ECOWRAP",
  amount = 0,
  transferNote = "",
  expiresAt,
  onIHavePaid,
}) {
  const labelRow = "text-sm text-gray-500";
  const valueRow = "font-medium text-gray-900 break-all";
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${
    amount || ""
  }&addInfo=${toUrlParam(transferNote)}&accountName=${toUrlParam(accountName)}`;

  return (
    <Card className="mt-3 border border-emerald-200 bg-emerald-50/30">
      <CardBody className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* QR */}
          <div className="shrink-0">
            <img
              src={qrUrl}
              alt="VietQR"
              className="w-44 h-44 rounded-lg border border-gray-200 bg-white object-contain"
            />
            <div className="text-xs text-gray-500 mt-2">
              Quét mã VietQR bằng ứng dụng ngân hàng để điền sẵn số tiền & nội
              dung.
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className={labelRow}>Ngân hàng</div>
              <div className={valueRow}>{bankCode}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className={labelRow}>Số tài khoản</div>
                <div className={valueRow}>{accountNumber}</div>
              </div>
              <CopyBtn text={accountNumber} label="Copy STK" />
            </div>

            <div className="sm:col-span-2">
              <div className={labelRow}>Chủ tài khoản</div>
              <div className={valueRow}>{accountName}</div>
            </div>

            <div>
              <div className={labelRow}>Số tiền</div>
              <div className={valueRow}>{formatVND(amount)}</div>
            </div>

            <div className="flex items-start gap-2 sm:col-span-2">
              <div className="flex-1">
                <div className={labelRow}>Nội dung chuyển khoản (bắt buộc)</div>
                <div className={`${valueRow} text-emerald-700`}>
                  {transferNote}
                </div>
              </div>
              <CopyBtn text={transferNote} label="Copy ND" />
            </div>

            {expiresAt && (
              <div className="sm:col-span-2">
                <div className={labelRow}>Hạn thanh toán</div>
                <div className={valueRow}>
                  {new Date(expiresAt).toLocaleString("vi-VN")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col sm:flex-row items-start gap-2">
          <Button color="primary" onPress={onIHavePaid}>
            Tôi đã chuyển khoản
          </Button>
          <div className="text-xs text-gray-500">
            Sau khi chuyển khoản, hệ thống sẽ kiểm tra và cập nhật trạng thái
            đơn hàng.
          </div>
        </div>

        {/* Notes */}
        <ul className="mt-3 list-disc list-inside text-xs text-gray-500 space-y-1">
          <li>
            Vui lòng chuyển <b>đúng số tiền và nội dung</b> để xử lý nhanh.
          </li>
          <li>Nếu chuyển thiếu/thừa, bộ phận CSKH sẽ liên hệ hỗ trợ.</li>
          <li>Quá hạn thanh toán, đơn có thể bị hủy để nhường tồn kho.</li>
        </ul>
      </CardBody>
    </Card>
  );
}
