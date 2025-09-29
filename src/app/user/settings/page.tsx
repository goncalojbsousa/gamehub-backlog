'use client'

import Link from 'next/link';
import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/src/context/userContext";
import { validateUsername, sanitizeUsername } from "@/src/utils/validationUtils";

interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  isProfilePublic: boolean;
}

export default function ProfileSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { updateUserData, userRole } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameValidation, setUsernameValidation] = useState<{ isValid: boolean; error?: string } | null>(null);
  const searchParams = useSearchParams();

  const [steamLinked, setSteamLinked] = useState<boolean>(false);
  // If the user registered/logged in with Steam, their email will be a steamcommunity.com alias.
  // In that case, we should not render link/unlink controls.
  const isSteamEmail = Boolean(
    session?.user?.email && session.user.email.toLowerCase().endsWith('@steamcommunity.com')
  );

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    username: '',
    bio: '',
    isProfilePublic: true,
  });

  // Load user data when session is available
  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/getCurrentUser');
          if (response.ok) {
            const userData = await response.json();
            setFormData({
              name: userData.name || '',
              username: userData.username || '',
              bio: userData.bio || '',
              isProfilePublic: userData.isProfilePublic !== undefined ? userData.isProfilePublic : true,
            });
            setSteamLinked(!!userData.steamId);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [session]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in');
    }
  }, [status, router]);

  // If redirected from Steam linking flow, complete the link on server
  useEffect(() => {
    const handleCompleteLink = async () => {
      if (searchParams?.get('linked') === '1') {
        try {
          const res = await fetch('/api/user/completeSteamLink', { method: 'POST' });
          if (res.ok) {
            setMessage({ type: 'success', text: 'Steam linked successfully.' });
            // Reload current user
            const refreshed = await fetch('/api/user/getCurrentUser');
            if (refreshed.ok) {
              const data = await refreshed.json();
              setSteamLinked(!!data.steamId);
            }
          } else {
            const err = await res.json().catch(() => ({}));
            setMessage({ type: 'error', text: err.message || 'Failed to complete Steam linking.' });
          }
        } catch (e) {
          setMessage({ type: 'error', text: 'Unexpected error completing Steam linking.' });
        } finally {
          // Clean the query param
          const url = new URL(window.location.href);
          url.searchParams.delete('linked');
          window.history.replaceState({}, '', url.toString());
        }
      }
    };
    handleCompleteLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // If redirected with an explicit steam link error, show message and clear param
  useEffect(() => {
    const error = searchParams?.get('steam_link_error');
    if (!error) return;
    if (error === 'already_linked') {
      setMessage({ type: 'error', text: 'This Steam account is already linked to another account.' });
    } else {
      setMessage({ type: 'error', text: 'Failed to link Steam account.' });
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('steam_link_error');
    window.history.replaceState({}, '', url.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === session?.user?.username) {
      setUsernameAvailable(null);
      return;
    }

    setUsernameChecking(true);
    try {
      const response = await fetch('/api/user/checkUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleUsernameChange = (username: string) => {
    setFormData(prev => ({ ...prev, username }));
    setUsernameAvailable(null);
    
    // Validate username format
    const validation = validateUsername(username);
    setUsernameValidation(validation);
    
    // Only check availability if username is valid
    if (validation.isValid) {
      // Debounce username check
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username before submission
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      setMessage({ type: 'error', text: usernameValidation.error || 'Invalid username format' });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // Handle JSON parsing errors
        console.error('Failed to parse response:', parseError);
        setMessage({ type: 'error', text: 'Server error: Invalid response format' });
        setLoading(false);
        return;
      }

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // If username was changed, update context and redirect
        if (data.user && data.user.username !== session?.user?.username) {
          // Update user context
          updateUserData({
            username: data.user.username,
            usernameSlug: data.user.username,
          });
          
          // Force session update
          await fetch('/api/auth/update-session', { method: 'POST' });
          
          setTimeout(() => {
            window.location.href = `/user/${data.user.username}`;
          }, 1000);
        } else {
          // Update session data
          window.location.reload();
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color_accent mx-auto mb-4"></div>
              <p className="text-color_text_sec">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Background style similar to home page
  const mainStyle = {
    backgroundImage: `
      linear-gradient(to bottom, var(--gradient-start), var(--background)),
      url(/login-bg.webp)
    `,
    backgroundSize: '100% 1200px',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'var(--background)',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="transition-colors duration-200 pt-24 relative flex-1 bg-background" style={mainStyle}>
        <Navbar />
        
        <div className="relative z-10 flex-1">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail animate-slide-in-up">
                <h1 className="text-3xl font-bold text-color_text mb-6">Profile Settings</h1>
                
                {message && (
                  <div className={`mb-6 p-4 rounded-lg border-2 ${
                    message.type === 'success' 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-red-100 border-red-300 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {message.type === 'success' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="font-medium">{message.text}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-color_text mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 rounded-lg bg-color_sec border border-border_detail transition-colors duration-200 focus:outline-none focus:border-input_detail text-color_text placeholder-color_text_sec"
                      placeholder="Enter your display name"
                      maxLength={255}
                    />
                    <p className="text-xs text-color_text_sec mt-1">
                      This is how your name will appear to other users
                    </p>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-color_text mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-color_sec border transition-colors duration-200 focus:outline-none focus:border-input_detail text-color_text placeholder-color_text_sec ${
                          usernameValidation && !usernameValidation.isValid 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-border_detail'
                        }`}
                        placeholder="Enter your username"
                        maxLength={255}
                      />
                      {usernameChecking && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-color_accent"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Validation Messages */}
                    {usernameValidation && !usernameValidation.isValid && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {usernameValidation.error}
                      </p>
                    )}
                    
                    {usernameValidation && usernameValidation.isValid && usernameAvailable !== null && (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${
                        usernameAvailable ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {usernameAvailable ? (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Username is available
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Username is already taken
                          </>
                        )}
                      </p>
                    )}
                    
                    <p className="text-xs text-color_text_sec mt-1">
                      Must be 3-255 characters. Only letters, numbers, underscores (_), and hyphens (-) are allowed. No spaces.
                    </p>
                  </div>

                  {/* Bio Field */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-semibold text-color_text mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full p-3 rounded-lg bg-color_sec border border-border_detail transition-colors duration-200 focus:outline-none focus:border-input_detail text-color_text placeholder-color_text_sec resize-none"
                      placeholder="Tell others about yourself..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-color_text_sec mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Privacy Setting */}
                  <div>
                    <div className="flex items-center justify-between p-4 bg-color_main rounded-lg border border-border_detail">
                      <div>
                        <label className="text-sm font-semibold text-color_text">
                          Make my profile public
                        </label>
                        <p className="text-xs text-color_text_sec mt-1">
                          When enabled, other users can view your profile and game collection
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isProfilePublic: !prev.isProfilePublic }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-color_accent focus:ring-offset-2 ${
                          formData.isProfilePublic ? 'bg-color_accent' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            formData.isProfilePublic ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Steam Linking */}
                  {!isSteamEmail && (
                    <div>
                      <div className="flex items-center justify-between p-4 bg-color_main rounded-lg border border-border_detail">
                        <div>
                          <label className="text-sm font-semibold text-color_text">
                            Steam Account
                          </label>
                          <p className="text-xs text-color_text_sec mt-1">
                            {steamLinked ? 'Your Steam account is linked.' : 'Link your Steam account to sign in with Steam and use Steam-based features.'}
                          </p>
                        </div>
                        {steamLinked ? (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/user/unlinkSteam', { method: 'POST' });
                                if (res.ok) {
                                  setSteamLinked(false);
                                  setMessage({ type: 'success', text: 'Steam unlinked successfully.' });
                                } else {
                                  const err = await res.json().catch(() => ({}));
                                  setMessage({ type: 'error', text: err.message || 'Failed to unlink Steam.' });
                                }
                              } catch {
                                setMessage({ type: 'error', text: 'Unexpected error unlinking Steam.' });
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Unlink Steam
                          </button>
                        ) : (
                          <Link
                            href="/api/auth/link/steam"
                            className="px-4 py-2 bg-color_reverse_sec text-color_main rounded-md hover:bg-color_reverse transition-colors"
                          >
                            Link Steam
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || usernameAvailable === false || (usernameValidation !== null && !usernameValidation.isValid)}
                      className="w-full py-4 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 