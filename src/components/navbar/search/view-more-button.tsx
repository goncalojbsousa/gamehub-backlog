import Link from "next/link";

interface ViewMoreButtonProps {
    searchTerm: string;
}

export const ViewMoreButton = ({ searchTerm }: ViewMoreButtonProps) => (
    <div className="p-2 pt-0">
        <Link href={`/search?term=${searchTerm}`} className="w-full items-center text-center flex p-2 rounded-md hover:bg-color_main">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2  fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
            </svg>
            View more...
        </Link>
    </div>
);