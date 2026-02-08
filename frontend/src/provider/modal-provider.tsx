"use client";

import { useState } from "react";
import { RegisterModal } from "@/modules/home/components/modals/register-modal";

export function ModalProvider() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <RegisterModal
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      {/* en el futuro: LoginModal, ForgotPasswordModal, etc */}
    </>
  );
}
