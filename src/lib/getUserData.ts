'use server'

export async function getUserData(username: string) {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/getUserData?username=${username}`);
    if (!response.ok) {
      return null;
    }
    return response.json();
  }