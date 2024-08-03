import React, { useState } from 'react';
import Modal from '@/src/components/modal';
import { ProgressIcon } from './svg/progress';
import { StatusIcon } from './svg/status';
import { GameControlerIcon } from './svg/game-controler';
import { useSession } from 'next-auth/react';

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
}

export const ModalContent: React.FC<ModalProps> = ({ isModalOpen, closeModal, selectedOption, handleOptionClick, selectedProgress, handleProgressClick, gameId }) => {
    const { data: session } = useSession();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        if (!session?.user?.id || !selectedOption || !selectedProgress) {
            alert('Please select both status and progress');
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch('/api/game/updateGameStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    gameId: gameId,
                    status: selectedOption,
                    progress: selectedProgress,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update game status');
            }

            closeModal();
            // update local state
        } catch (error) {
            console.error('Error updating game status:', error);
            alert('Failed to update game status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };


    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="p-2">
                <div className='flex items-center justify-center'>
                    <h1 className="text-color_text text-2xl font-bold">Register your history with this game!</h1>
                    <GameControlerIcon className='fill-color_icons ml-2' />
                </div>

                <div className='flex items-center mt-8'>
                    <StatusIcon className='fill-color_icons mr-2' />
                    <p className="text-color_text">Status</p>
                </div>

                <div className="flex justify-center">
                    {['Plan to play', 'Dropped', 'Playing', 'Played'].map(option => (
                        <SelectionButton
                            key={option}
                            text={option}
                            isSelected={selectedOption === option}
                            onClick={() => handleOptionClick(option)}
                        />
                    ))}
                </div>

                <div className='flex items-center mt-4'>
                    <ProgressIcon className='fill-color_icons mr-2' />
                    <p className="text-color_text">Progress</p>
                </div>

                <div className="flex justify-center">
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
            <div className='flex items-center justify-center p-2 gap-x-4 mt-4'>
                <button className="text-color_text bg-red-800 p-2 rounded-lg hover:bg-red-900"
                    onClick={closeModal}
                >
                    Cancel
                </button>

                <button
                    className="text-color_text bg-blue-800 p-2 rounded-lg hover:bg-blue-900"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Update'}
                </button>
            </div>
        </Modal>
    )
};
