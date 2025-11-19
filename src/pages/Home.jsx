import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Hero Section */}
      <section className='flex-1 flex items-center justify-center py-20 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='mb-8'>
            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-white font-bold text-4xl">T</span>
            </div> */}
          </div>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6'>
            Welcome to{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              TaskFlow
            </span>
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
            Your ultimate task management solution. Organize, prioritize, and
            complete your tasks with ease.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/signup'
              className='px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg'
            >
              Get Started
            </Link>
            <Link
              to='/login'
              className='px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 '>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12'>
            Why Choose TaskFlow?
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-blue-600 dark:text-blue-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Easy Task Management
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Create, update, and organize your tasks effortlessly with our
                intuitive interface.
              </p>
            </div>

            <div className='text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
              <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-purple-600 dark:text-purple-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Priority & Status
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Set priorities and track status to stay on top of your most
                important tasks.
              </p>
            </div>

            <div className='text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Smart Filtering
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Filter tasks by status, priority, or search to find exactly what
                you need.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
