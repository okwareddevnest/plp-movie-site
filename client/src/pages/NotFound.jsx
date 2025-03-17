import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-secondary">404</h1>
        <h2 className="text-4xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-4 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-md transition-colors inline-block"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 