import React, { useState } from 'react';
import Modal from '@/src/components/modal';
import { ProgressIcon } from './svg/progress';
import { StatusIcon } from './svg/status';
import { GameControlerIcon } from './svg/game-controler';
import { checkIsAuthenticated } from '../lib/auth/checkIsAuthenticated';
import { getUserId } from '../lib/auth/getUserIdServerAction';
import { Notification } from '@/src/components/notification'

interface ButtonProps {
    text: string;
    isSelected: boolean;
    onClick: () => void;
}

const SelectionButton: React.FC<ButtonProps> = ({ text, isSelected, onClick }) => (
    <button
        className={`p-2 px-4 m-2 border border-border_detail rounded-lg transition-colors duration-300  ${isSelected
            ? 'bg-color_main text-color_text border-border_detail_sec'
            : 'text-color_text_sec hover:bg-color_main hover:border-color_icons hover:text-color_text'}`
        }
        onClick={onClick}
    >
        {text}
    </button>
);

interface ModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    selectedOption: string;
    handleOptionClick: (option: string) => void;
    selectedProgress: string;
    handleProgressClick: (progress: string) => void;
    gameId: number;
    setCurrentOption: React.Dispatch<React.SetStateAction<string>>;
    setCurrentProgress: React.Dispatch<React.SetStateAction<string>>;
}


export const ModalContent: React.FC<ModalProps> = ({ isModalOpen, closeModal, selectedOption, handleOptionClick, selectedProgress, handleProgressClick, gameId, setCurrentOption, setCurrentProgress }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleUpdate = async () => {
        if (!selectedOption || !selectedProgress) {
            setNotification({ message: 'Please select both status and progress', type: 'error' });
            return;
        }

        const isAuthenticated = await checkIsAuthenticated();
        if (!isAuthenticated) {
            setNotification({ message: 'Please authenticate', type: 'error' });
            return;
        }
        setIsUpdating(true);

        try {
            const userId = await getUserId();

            const response = await fetch('/api/game/updateGameStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    gameId: gameId,
                    status: selectedOption,
                    progress: selectedProgress,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update game status');
            }

            setCurrentOption(selectedOption);
            setCurrentProgress(selectedProgress);
            setNotification({ message: 'Game status updated successfully', type: 'success' });

            closeModal();
        } catch (error) {
            console.error('Error updating game status:', error);
            setNotification({ message: 'Failed to update game status. Please try again.', type: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };


    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="p-2 sm:p-4 max-w-[90vw] sm:max-w-md md:max-w-lg mx-auto">
                    <div className='flex items-center justify-center'>
                        <h1 className="text-color_text text-xl sm:text-2xl font-bold">Register your history with this game!</h1>
                        <GameControlerIcon className='fill-color_icons ml-2' />
                    </div>

                    <div>
                        <div className='flex items-center mt-8'>
                            <StatusIcon className='fill-color_icons mr-2' />
                            <p className="text-color_text">Status</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {['Played', 'Playing', 'Dropped', 'Plan to play'].map(option => (
                                <SelectionButton
                                    key={option}
                                    text={option}
                                    isSelected={selectedOption === option}
                                    onClick={() => handleOptionClick(option)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center mt-4'>
                            <ProgressIcon className='fill-color_icons mr-2' />
                            <p className="text-color_text">Progress</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {['Unfinished', 'Beaten', 'Completed', 'Continuous'].map(progress => (
                                <SelectionButton
                                    key={progress}
                                    text={progress}
                                    isSelected={selectedProgress === progress}
                                    onClick={() => handleProgressClick(progress)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-center p-4 gap-x-4 mt-4 flex-col'>
                    <button
                        className="text-color_main bg-color_reverse_sec py-2 px-4 rounded-lg hover:bg-color_reverse w-full mb-4"
                        onClick={handleUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                    <button className="text-white bg-red-800  py-2 px-4 rounded-lg hover:bg-red-900 w-full"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </>
    )
};