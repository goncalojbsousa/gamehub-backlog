'use server'
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserName } from '@/src/lib/auth/getUserNameServerAction';
import { getUserImage } from '@/src/lib/auth/getUserImageServerAction';
import { getUserNameSlug } from '@/src/lib/auth/getUserNameSlugServerAction';
import { getUserRole } from '@/src/lib/auth/getUserRoleServerAction';
import { UserProvider } from '@/src/context/userContext';
import { auth } from '@/src/lib/auth/authConfig';

/**
 * UserDataFetcher component - Server-side user data initialization
 * Fetches user data on the server side for fast rendering and SEO optimization
 * Provides user context to the entire application with pre-fetched authentication data
 * Handles authentication verification and data validation
 * 
 * @param children - React components to be wrapped with user context
 * @returns UserProvider component with initialized user data
 */
export default async function UserDataFetcher({ children }: { children: React.ReactNode }) {
  // Double authentication verification
  const session = await auth();
  const isAuthenticated = session && session.user ? true : false;
  
  // Initialize user data variables
  let username = '';
  let usernameSlug = '';
  let userImage = '';
  let userRole = '';

  // Fetch user data if authenticated
  if (isAuthenticated && session?.user) {
    try {
      // Retrieve user information from database
      username = (await getUserName()) || '';
      usernameSlug = (await getUserNameSlug()) || '';
      const imageResult = await getUserImage();
      
      // Ensure userImage is never an empty string
      userImage = imageResult && imageResult.trim() !== '' ? imageResult : '';
      
      userRole = (await getUserRole()) || '';
      
      // Additional verification: if we can't fetch data, treat as not authenticated
      if (!username && !usernameSlug) {
        console.log('User authenticated but without valid data, treating as not authenticated');
        return (
          <UserProvider
            initialData={{
              isAuthenticated: false,
              username: '',
              usernameSlug: '',
              userImage: '',
              userRole: '',
            }}
          >
            {children}
          </UserProvider>
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If there's an error fetching data, treat as not authenticated
      return (
        <UserProvider
          initialData={{
            isAuthenticated: false,
            username: '',
            usernameSlug: '',
            userImage: '',
            userRole: '',
          }}
        >
          {children}
        </UserProvider>
      );
    }
  }

  // Return UserProvider with fetched or default data
  return (
    <UserProvider
      initialData={{
        isAuthenticated,
        username,
        usernameSlug,
        userImage,
        userRole,
      }}
    >
      {children}
    </UserProvider>
  );
}