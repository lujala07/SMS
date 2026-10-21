import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './EditModal.css';

interface Props {
    open: boolean;
    title: string;
    busy: boolean;
    onClose: () => void;
    children: ReactNode;
}

function EditModal({ open, title, busy, onClose, children }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    useEffect(() => {
        const element = dialog.current;
        if (!open || !element) return;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        element.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            element.close();
            document.body.style.overflow = previousOverflow;
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, [open]);

    if (!open) return children;

    const close = () => { if (!busy) onClose(); };
    return createPortal(
        <dialog ref={dialog} aria-labelledby={titleId} className="edit-modal" onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
        }}>
            <div className="edit-modal-layout">
                <header className="edit-modal-header">
                    <h2 id={titleId}>{title}</h2>
                    <button type="button" onClick={close} disabled={busy} aria-label={`Close ${title}`}><X size={20} aria-hidden="true" /></button>
                </header>
                <div className="edit-modal-content" aria-busy={busy}>{children}</div>
            </div>
        </dialog>, document.body
    );
}

export default EditModal;
