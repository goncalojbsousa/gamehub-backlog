import React, { useState } from 'react';
import Modal from '@/src/components/modal';
import { ProgressIcon } from '@/src/components/svg/progress';
import { StatusIcon } from '@/src/components/svg/status';
import { GameControlerIcon } from '@/src/components/svg/game-controler';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { Notification } from '@/src/components/notification'
import { useRouter } from 'next/navigation';

interface ButtonProps {
    text: string;
    isSelected: boolean;
    onClick: () => void;
}

const SelectionButton: React.FC<ButtonProps> = ({ text, isSelected, onClick }) => (
    <button
        className={`p-3 px-8 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap ${
            isSelected
                ? 'bg-color_reverse_sec text-color_main border-2 border-color_reverse_sec shadow-lg transform scale-105'
                : 'bg-color_main text-color_text border border-border_detail hover:bg-color_click hover:border-border_detail_sec hover:shadow-md transform hover:scale-105'
        }`}
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
    const router = useRouter();

    const handleUpdate = async () => {
        if (!selectedOption || !selectedProgress) {
            setNotification({ message: 'Please select both status and progress', type: 'error' });
            return;
        }

        const isAuthenticated = await checkIsAuthenticated();
        if (!isAuthenticated) {
            router.push('/auth/sign-in');
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
                <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail max-w-2xl w-full mx-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <GameControlerIcon className='fill-color_icons w-8 h-8 mr-4' />
                            <h1 className="text-color_text text-3xl font-bold">Track Your Progress</h1>
                        </div>
                        <p className="text-color_text_sec text-base">Register your history with this game!</p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Status Section */}
                        <div>
                            <div className="flex items-center mb-4">
                                <StatusIcon className='fill-color_icons w-6 h-6 mr-3' />
                                <h2 className="text-color_text font-semibold text-xl">Status</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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

                        {/* Progress Section */}
                        <div>
                            <div className="flex items-center mb-4">
                                <ProgressIcon className='fill-color_icons w-6 h-6 mr-3' />
                                <h2 className="text-color_text font-semibold text-xl">Progress</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            className="flex-1 bg-color_reverse_sec text-color_main py-4 px-8 rounded-lg hover:bg-color_reverse transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-color_main mr-3"></div>
                                    Updating...
                                </div>
                            ) : (
                                'Update Status'
                            )}
                        </button>
                        <button 
                            className="flex-1 bg-color_main text-color_text py-4 px-8 rounded-lg hover:bg-color_click transition-all duration-200 font-medium border border-border_detail hover:border-red-500"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
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