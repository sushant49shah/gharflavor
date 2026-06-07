
import { useNavigate } from 'react-router-dom';
import sadDogImage from '../assets/pagenotfound.png';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-bg-dark to-bg-darker flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Huge 404 */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[150px] font-black text-transparent bg-clip-text bg-linear-to-r from-accent via-primary to-accent animate-bounce">
            404
          </h1>
        </div>

        {/* Messages */}
        <div className="mb-8 space-y-4">
          <p className="text-xl md:text-2xl font-semibold text-white">
            We looked everywhere.
          </p>
          <p className="text-lg md:text-xl text-text-muted leading-relaxed">
            Oops, The page you are looking for is beyond our reach.
          </p>
          <p className="text-sm md:text-base text-accent/70 italic mt-6">
            (Even our developers can't find it 😅)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent/50"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Go Back
          </button>
        </div>

        {/* Sad dog image */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-accent to-primary opacity-20 blur-xl rounded-2xl"></div>
            <img
              src={sadDogImage}
              alt="Sad dog"
              className="relative h-48 md:h-64 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
