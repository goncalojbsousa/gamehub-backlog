import React, { useEffect } from 'react';
import { ErrorIcon } from './svg/error-icon';
import { SuccessIcon } from './svg/success-icon';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        // TIMEOUT TO CALL onClose AFTER 5 SECOUNDS
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // CLEAN THE TIMER WHEN TIMEOUT COMPLETES
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-4 left-4 p-4 rounded-md shadow-lg z-50 bg-color_main flex items-center border-2 ${type === 'success' ? 'border-color_success' : 'border-color_error'
                } text-white`}
        >
            {type === 'success'
                ? <SuccessIcon className='fill-color_success mr-2' />
                : <ErrorIcon className='fill-color_error mr-2' />
            }

            <p className='text-color_text text-lg'>{message}</p>
            {/*<button onClick={onClose} className="absolute top-1 right-1 text-color_text">
                &times;
            </button>*/}
        </div>
    );
};
