import React, { useEffect } from 'react';
import { ErrorIcon } from '@/src/components/svg/alert/error-icon';
import { SuccessIcon } from '@/src/components/svg/alert/success-icon';

/**
 * Props interface for the Notification component
 * Defines the properties for notification display and behavior
 */
interface NotificationProps {
    message: string;        // Text message to display in the notification
    type: 'success' | 'error'; // Type of notification for styling and icon
    onClose: () => void;    // Function to call when notification should be closed
}

/**
 * Notification component - Toast-style user feedback
 * Displays temporary success or error messages with auto-dismiss functionality
 * Includes appropriate icons and styling based on notification type
 * 
 * @param message - Text message to display
 * @param type - Type of notification ('success' or 'error')
 * @param onClose - Function to call when notification closes
 * @returns JSX element representing the notification toast
 */
export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        // Auto-dismiss notification after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // Clean up timer when component unmounts or onClose changes
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-4 left-4 p-4 rounded-md shadow-lg z-50 bg-color_main flex items-center border-2 ${type === 'success' ? 'border-color_success' : 'border-color_error'
                } text-white`}
        >
            {/* Display appropriate icon based on notification type */}
            {type === 'success'
                ? <SuccessIcon className='fill-color_success mr-2' />
                : <ErrorIcon className='fill-color_error mr-2' />
            }

            <p className='text-color_text text-lg'>{message}</p>
            {/* Manual close button (currently disabled)
            <button onClick={onClose} className="absolute top-1 right-1 text-color_text">
                &times;
            </button>*/}
        </div>
    );
};
