'use server'
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserName } from '@/src/lib/auth/getUserNameServerAction';
import { getUserImage } from '@/src/lib/auth/getUserImageServerAction';
import { getUserNameSlug } from '@/src/lib/auth/getUserNameSlugServerAction';
import { UserProvider } from '@/src/context/userContext';
import { auth } from '@/src/lib/auth/authConfig';

/**
 *  GET USER DATA ON SERVER SIDE FOR FAST RENDERING
 * @param param0 
 * @returns userContext
 */
export default async function UserDataFetcher({ children }: { children: React.ReactNode }) {
  // Verificação dupla da autenticação
  const session = await auth();
  const isAuthenticated = session && session.user ? true : false;
  
  let username = '';
  let usernameSlug = '';
  let userImage = '';

  if (isAuthenticated && session?.user) {
    try {
      username = (await getUserName()) || '';
      usernameSlug = (await getUserNameSlug()) || '';
      const imageResult = await getUserImage();
      // Garantir que userImage nunca seja uma string vazia
      userImage = imageResult && imageResult.trim() !== '' ? imageResult : '';
      
      // Verificação adicional: se não conseguimos buscar os dados, considerar como não autenticado
      if (!username && !usernameSlug) {
        console.log('Usuário autenticado mas sem dados válidos, tratando como não autenticado');
        return (
          <UserProvider
            initialData={{
              isAuthenticated: false,
              username: '',
              usernameSlug: '',
              userImage: '',
            }}
          >
            {children}
          </UserProvider>
        );
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Se houver erro ao buscar dados, considerar como não autenticado
      return (
        <UserProvider
          initialData={{
            isAuthenticated: false,
            username: '',
            usernameSlug: '',
            userImage: '',
          }}
        >
          {children}
        </UserProvider>
      );
    }
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