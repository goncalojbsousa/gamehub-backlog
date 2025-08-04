import React, { useState } from 'react';
import Modal from '@/src/components/modal';
import { ProgressIcon } from '@/src/components/svg/progress';
import { StatusIcon } from '@/src/components/svg/status';
import { GameControlerIcon } from '@/src/components/svg/game-controler';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { Notification } from '@/src/components/notification'
import { useRouter } from 'next/navigation';

/**
 * Props interface for the SelectionButton component
 * Defines the properties for individual selection buttons in the modal
 */
interface ButtonProps {
    text: string;           // Button display text
    isSelected: boolean;    // Whether this button is currently selected
    onClick: () => void;    // Click handler function
}

/**
 * SelectionButton component - Individual selectable button
 * Renders a button with different styles based on selection state
 * Used for status and progress selection in the modal
 * 
 * @param text - Display text for the button
 * @param isSelected - Whether the button is currently selected
 * @param onClick - Function to call when button is clicked
 * @returns JSX element for the selection button
 */
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

/**
 * Props interface for the ModalContent component
 * Defines all properties required for the game status update modal
 */
interface ModalProps {
    isModalOpen: boolean;   // Controls modal visibility
    closeModal: () => void; // Function to close the modal
    selectedOption: string; // Currently selected game status
    handleOptionClick: (option: string) => void; // Status selection handler
    selectedProgress: string; // Currently selected progress
    handleProgressClick: (progress: string) => void; // Progress selection handler
    gameId: number;         // ID of the game being updated
    setCurrentOption: React.Dispatch<React.SetStateAction<string>>; // Status state setter
    setCurrentProgress: React.Dispatch<React.SetStateAction<string>>; // Progress state setter
}

/**
 * ModalContent component - Game status update modal
 * Allows users to update their game status and progress
 * Handles authentication, API calls, and user feedback
 * 
 * @param isModalOpen - Controls modal visibility
 * @param closeModal - Function to close the modal
 * @param selectedOption - Currently selected game status
 * @param handleOptionClick - Status selection handler
 * @param selectedProgress - Currently selected progress
 * @param handleProgressClick - Progress selection handler
 * @param gameId - ID of the game being updated
 * @param setCurrentOption - Status state setter
 * @param setCurrentProgress - Progress state setter
 * @returns JSX element for the complete modal content
 */
export const ModalContent: React.FC<ModalProps> = ({ isModalOpen, closeModal, selectedOption, handleOptionClick, selectedProgress, handleProgressClick, gameId, setCurrentOption, setCurrentProgress }) => {
    // State management for update process and user feedback
    const [isUpdating, setIsUpdating] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    /**
     * Handles the game status update process
     * Validates input, checks authentication, and makes API call
     * Provides user feedback through notifications
     */
    const handleUpdate = async () => {
        // Validate that both status and progress are selected
        if (!selectedOption || !selectedProgress) {
            setNotification({ message: 'Please select both status and progress', type: 'error' });
            return;
        }

        // Check user authentication before proceeding
        const isAuthenticated = await checkIsAuthenticated();
        if (!isAuthenticated) {
            router.push('/auth/sign-in');
            return;
        }
        
        // Set updating state to show loading indicator
        setIsUpdating(true);

        try {
            // Get current user ID for the API call
            const userId = await getUserId();

            // Make API request to update game status
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

            // Handle API response
            if (!response.ok) {
                throw new Error('Failed to update game status');
            }

            // Update local state with new values
            setCurrentOption(selectedOption);
            setCurrentProgress(selectedProgress);
            setNotification({ message: 'Game status updated successfully', type: 'success' });

            // Close modal on successful update
            closeModal();
        } catch (error) {
            console.error('Error updating game status:', error);
            setNotification({ message: 'Failed to update game status. Please try again.', type: 'error' });
        } finally {
            // Reset updating state regardless of outcome
            setIsUpdating(false);
        }
    };

    return (
        <>
            {/* Main modal container */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail max-w-2xl w-full mx-4">
                    {/* Modal header with title and description */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <GameControlerIcon className='fill-color_icons w-8 h-8 mr-4' />
                            <h1 className="text-color_text text-3xl font-bold">Track Your Progress</h1>
                        </div>
                        <p className="text-color_text_sec text-base">Register your history with this game!</p>
                    </div>

                    {/* Content grid with status and progress sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Game Status Selection Section */}
                        <div>
                            <div className="flex items-center mb-4">
                                <StatusIcon className='fill-color_icons w-6 h-6 mr-3' />
                                <h2 className="text-color_text font-semibold text-xl">Status</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Status option buttons */}
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

                        {/* Game Progress Selection Section */}
                        <div>
                            <div className="flex items-center mb-4">
                                <ProgressIcon className='fill-color_icons w-6 h-6 mr-3' />
                                <h2 className="text-color_text font-semibold text-xl">Progress</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Progress option buttons */}
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

                    {/* Action buttons for update and cancel */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Update button with loading state */}
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
                        {/* Cancel button */}
                        <button 
                            className="flex-1 bg-color_main text-color_text py-4 px-8 rounded-lg hover:bg-color_click transition-all duration-200 font-medium border border-border_detail hover:border-red-500"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
            
            {/* Notification component for user feedback */}
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