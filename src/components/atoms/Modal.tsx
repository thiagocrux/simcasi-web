'use client';

import { FocusTrap } from 'focus-trap-react';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  shouldCloseOnBackdropClick?: boolean;
  closeModal: () => void;
  children?: ReactNode;
  customClasses?: string;
  hideCloseButton?: boolean;
}

export default function Modal({
  isOpen = false,
  closeModal,
  children,
  shouldCloseOnBackdropClick = false,
  customClasses = '',
  hideCloseButton = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling without hiding content
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  function handleBackdropClick() {
    if (!shouldCloseOnBackdropClick) {
      return;
    }

    closeModal();
  }

  return ReactDOM.createPortal(
    <div
      className="bg-backdrop fixed inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: 'auto' }}
      onClick={handleBackdropClick}
    >
      <FocusTrap>
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-background relative mx-20 min-w-80 rounded-md px-6 py-8"
        >
          {!hideCloseButton && (
            <button
              onClick={closeModal}
              className="hover:bg-border absolute top-2 right-2 cursor-pointer rounded-md p-1"
            >
              <X size={16} />
            </button>
          )}
          <div className={customClasses}>{children}</div>
        </div>
      </FocusTrap>
    </div>,
    document.body
  );
}
