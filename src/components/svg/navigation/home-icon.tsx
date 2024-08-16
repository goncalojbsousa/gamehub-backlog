import React from 'react';
import type { SVGProps } from 'react';

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" {...props} width="1em" height="1em" viewBox="0 0 24 24">
            <path d="M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75" />
        </svg>
    );
}