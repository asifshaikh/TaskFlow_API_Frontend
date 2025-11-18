import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const handleOAuthCallback = () => {
         // Get token from URL query params
            const token = searchParams.get('token');
            const user = searchParams.get('user');

            if (token && user) 
            {
                try 
                {
                    const userData = JSON.parse(decodeURIComponent(user));
                    login(userData, token);
                    navigate('/dashboard',{ replace: true });
                } 
                catch (error) 
                {
                    console.error('OAuth callback error:', error);
                    navigate('/login?error=oauth_failed',{ replace: true });
                }
            } 
            else 
            {
                console.error('Missing token or user data in OAuth callback');
                navigate('/login?error=oauth_failed', { replace: true });
            }
        };

    handleOAuthCallback();
    }, []);

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing login...</p>
        </div>
    </div>
    );
};

export default OAuthCallback;