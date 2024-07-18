export const Card = (props: { children?: React.ReactNode; }) => {
    return (
        <div className="bg-color_sec shadow-md border border-border_detail rounded-md">
            {props.children || ""}
        </div>
    )
}