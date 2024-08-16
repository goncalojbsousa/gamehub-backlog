'use server'
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserName } from '@/src/lib/auth/getUserNameServerAction';
import { getUserImage } from '@/src/lib/auth/getUserImageServerAction';
import { getUserNameSlug } from '@/src/lib/auth/getUserNameSlugServerAction';
import { UserProvider } from '@/src/context/userContext';


/**
 *  GET USER DATA ON SERVER SIDE FOR FAST RENDERING
 * @param param0 
 * @returns userContext
 */
export default async function UserDataFetcher({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await checkIsAuthenticated();
  let username = '';
  let usernameSlug = '';
  let userImage = '';

  if (isAuthenticated) {
    username = (await getUserName()) || '';
    usernameSlug = (await getUserNameSlug()) || '';
    userImage = (await getUserImage()) || '';
  }

  return (
    <UserProvider
      initialData={{
        isAuthenticated,
        username,
        usernameSlug,
        userImage,
      }}
    >
      {children}
    </UserProvider>
  );
}