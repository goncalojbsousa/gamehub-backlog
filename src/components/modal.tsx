import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-gradient-to-br from-background to-color_main border border-border_detail p-4 rounded-lg shadow-lg">
                {/*<button onClick={onClose} className="absolute top-2 right-4 text-color_text text-2xl">
                    &times;
                </button>*/}
                {children}
            </div>
        </div>
    );
};

export default Modal;
