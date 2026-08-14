'use client';
import { useState } from 'react';
import ConsultationModal from './ConsultationModal';

interface ConsultationButtonProps {
  label: string;
  className?: string;
}

export default function ConsultationButton({ label, className = 'primary-btn' }: ConsultationButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      <ConsultationModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
