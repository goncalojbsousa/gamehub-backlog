/**
 * Card component - Basic container with consistent styling
 * Provides a standardized card layout with background, shadow, and border styling
 * Used as a base component for content containers throughout the application
 * 
 * @param props.children - Optional React children to render inside the card
 * @returns JSX element representing a styled card container
 */
export const Card = (props: { children?: React.ReactNode; }) => {
    return (
        <div className="bg-color_sec shadow-md border border-border_detail rounded-md">
            {props.children || ""}
        </div>
    )
}