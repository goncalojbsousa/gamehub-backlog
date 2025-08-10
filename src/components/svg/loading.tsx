import React from 'react';
import type { SVGProps } from 'react';

export function LoadingIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="24" 
			height="24" 
			viewBox="0 0 24 24" 
			fill="none" 
			{...props}
		>
			<circle 
				cx="12" 
				cy="12" 
				r="10" 
				stroke="currentColor" 
				strokeWidth="2" 
				strokeLinecap="round" 
				strokeDasharray="31.416" 
				strokeDashoffset="31.416"
				className="animate-spin"
				style={{
					animation: 'spin 1s linear infinite',
					transformOrigin: 'center'
				}}
			/>
			<style jsx>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
			`}</style>
		</svg>
	);
}