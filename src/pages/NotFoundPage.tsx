import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Home, ArrowLeft, Droplets } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-200 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            <Droplets size={20 + Math.random() * 10} />
          </div>
        ))}
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto">
        {/* Animated 404 number */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-blue-600 relative animate-pulse">
            4
            <span className="text-red-500 inline-block mx-2 animate-bounce">
              <Heart className="inline-block w-16 h-16 md:w-20 md:h-20 fill-current" />
            </span>
            4
          </h1>
          
          {/* Floating droplets around the number */}
          <div className="absolute -top-4 left-1/4 text-blue-400 animate-bounce">
            <Droplets size={24} />
          </div>
          
          <div className="absolute -top-2 right-1/4 text-red-400 animate-bounce" style={{animationDelay: '1s'}}>
            <Droplets size={20} />
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-4">
            Oops! Trang không tìm thấy
          </h2>
          <p className="text-blue-600 text-lg mb-2">
            Có vẻ như trang bạn đang tìm kiếm đã bị thất lạc
          </p>
          <p className="text-blue-500">
            Giống như một giọt máu quý giá, chúng tôi sẽ giúp bạn tìm đường về đúng nơi!
          </p>
        </div>

        {/* Animated heart with pulse */}
        <div className="mb-8 flex justify-center">
          <div className="bg-red-100 p-6 rounded-full animate-pulse">
            <Heart className="w-12 h-12 text-red-500 fill-current" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <Home size={20} />
            Về Trang Chủ
          </button>
          
          <button
            onClick={handleGoBack}
            className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <ArrowLeft size={20} />
            Quay Lại
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center items-center gap-4 text-blue-400">
          <div className="animate-spin">
            <Droplets size={16} />
          </div>
          <span className="text-sm">Cảm ơn bạn đã quan tâm đến việc hiến máu</span>
          <div className="animate-pulse">
            <Heart className="fill-current" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;