import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";

export default function OtpModal({
  open = false,
  onClose,
  email = "",
  loading = false,
  cooldown = 0,
  onVerify,
  onResend,
}) {
  const [otp, setOtp] = React.useState("");
  const [err, setErr] = React.useState("");
  const inputRef = React.useRef(null);

  // Reset state & focus khi mở
  React.useEffect(() => {
    if (open) {
      setOtp("");
      setErr("");
      // đợi modal mount xong rồi focus
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const submit = () => {
    if (!/^\d{6}$/.test(otp)) {
      setErr("OTP phải gồm 6 chữ số");
      return;
    }
    setErr("");
    onVerify?.(otp);
  };

  const handleChange = (e) => {
    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(v);
    if (v.length === 6 && err) setErr(""); // gõ đủ 6 ký tự thì xóa lỗi
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && otp.length === 6) {
      submit();
    }
  };

  const handleResend = () => {
    if (loading || cooldown > 0) return; // guard thêm cho chắc
    onResend?.();
  };

  return (
    <Modal
      isOpen={open}
      onOpenChange={(next) => {
        if (!next) onClose?.(); // chỉ đóng khi người dùng/overlay yêu cầu
      }}
      hideCloseButton
      placement="center"
      backdrop="opaque"
      classNames={{
        base: "max-w-md", // gọn gàng
      }}
    >
      <ModalContent>
        <ModalHeader>Xác thực email</ModalHeader>
        <ModalBody>
          <p className="text-sm text-gray-600">
            Mã OTP đã gửi tới <b>{email}</b>. Hết hạn sau 15 phút.
          </p>

          <Input
            ref={inputRef}
            label="Mã OTP (6 số)"
            value={otp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={6}
            inputMode="numeric"
            variant="bordered"
            description="Chỉ nhập chữ số (0–9)"
            isInvalid={!!err}
            errorMessage={err || undefined}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={handleResend}
            isDisabled={loading || cooldown > 0}
          >
            {cooldown > 0 ? `Gửi lại (${cooldown}s)` : "Gửi lại mã"}
          </Button>
          <Button
            color="success"
            onPress={submit}
            isLoading={loading}
            isDisabled={loading || otp.length !== 6}
          >
            Xác thực
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
