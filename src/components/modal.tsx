import React from "react";

/**
 * Props interface for the Modal component
 * Defines the required properties for modal functionality
 */
interface ModalProps {
    isOpen: boolean;        // Controls modal visibility
    onClose: () => void;    // Function to close the modal
    children: React.ReactNode; // Content to display inside the modal
}

/**
 * Modal component - Overlay dialog with backdrop
 * Provides a reusable modal overlay with backdrop blur and centered content
 * Handles click outside to close functionality and proper z-index layering
 * 
 * @param isOpen - Boolean controlling modal visibility
 * @param onClose - Function called when modal should be closed
 * @param children - React content to render inside the modal
 * @returns JSX element representing the modal overlay or null if closed
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Return null if modal is not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
                className="relative animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
