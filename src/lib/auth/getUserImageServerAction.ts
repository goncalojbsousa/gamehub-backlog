'use server'

import { auth } from "@/src/lib/auth/authConfig"
import { processGoogleImageUrl } from "@/src/utils/imageUtils"

export const getUserImage = async () => {
    const session = await auth();
    if (session && session.user?.image) {
        let image = session.user.image.trim();
        
        // Ensure Google URL is valid using the utility function
        image = processGoogleImageUrl(image);
        
        // Return empty string if image is empty after trim
        return image || '';    
    }
    return '';
};