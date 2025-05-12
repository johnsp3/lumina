import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VideoUpload from '../components/VideoUpload/VideoUpload';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/auth';
import { getUserVideos, getPublicVideos } from '../firebase/storage';

function Gallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);

  // Fetch videos when component mounts or after successful upload
  useEffect(() => {
    const fetchVideos = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Get both user's videos and public videos
        const [userVideos, publicVideos] = await Promise.all([
          getUserVideos(),
          getPublicVideos()
        ]);
        
        // Format videos for display
        const formattedVideos = [
          ...userVideos.map(video => ({
            id: video.name,
            title: video.name.split('_').slice(1).join('_'), // Remove timestamp prefix
            src: video.downloadURL,
            date: new Date(parseInt(video.name.split('_')[0])).toLocaleDateString(),
            isPublic: false
          })),
          ...publicVideos.map(video => ({
            id: video.name,
            title: video.name.split('_').slice(1).join('_'), // Remove timestamp prefix
            src: video.downloadURL,
            date: new Date(parseInt(video.name.split('_')[0])).toLocaleDateString(),
            isPublic: true
          }))
        ];
        
        setVideos(formattedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser && !authLoading) {
      fetchVideos();
    }
  }, [currentUser, authLoading, uploadSuccess]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleUploadComplete = (videoData) => {
    console.log('Video uploaded successfully:', videoData);
    setUploadSuccess(true);
    // Close the modal after 2 seconds to show success message
    setTimeout(() => {
      setShowUploadModal(false);
      setUploadSuccess(false);
      // This will trigger the useEffect to reload videos
    }, 2000);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  // Filter videos based on active category and search query
  const filteredVideos = videos.filter(video => {
    // Handle category filtering
    if (activeCategory === 'interesting' && !video.isPublic) return false;
    
    // Handle search filtering
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // If loading or not authenticated, show loading spinner
  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container-padding py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
            Lumina
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* User and Logout */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-700">
                {currentUser?.email || currentUser?.displayName || 'User'}
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-500 px-3 py-1 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Video Section */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="aspect-video bg-gray-800 flex items-center justify-center">
            {videos.length > 0 ? (
              <video
                src={videos[0].src}
                controls
                className="w-full h-full"
                poster={videos[0].thumbnailUrl}
              />
            ) : (
              <p className="text-white">No video selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <main className="container-padding py-12">
        <div className="max-w-7xl mx-auto">
          {/* Upload Button and Categories Row */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3 overflow-x-auto">
              <button 
                className={`category-button ${activeCategory === 'all' ? 'category-button-active' : 'category-button-inactive'}`}
                onClick={() => setActiveCategory('all')}
              >
                All Videos
              </button>
              <button 
                className={`category-button ${activeCategory === 'favorites' ? 'category-button-active' : 'category-button-inactive'}`}
                onClick={() => setActiveCategory('favorites')}
              >
                Favorites
              </button>
              <button 
                className={`category-button ${activeCategory === 'interesting' ? 'category-button-active' : 'category-button-inactive'}`}
                onClick={() => setActiveCategory('interesting')}
              >
                Interesting
              </button>
            </div>
            
            {/* Upload Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Video
            </button>
          </div>
          
          {/* Video Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div key={video.id} className="video-thumbnail cursor-pointer">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    {/* Use video first frame as thumbnail by showing video tag without controls */}
                    <video
                      src={video.src}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      onClick={() => {
                        const videoEl = document.querySelector('.featured-video');
                        if (videoEl) {
                          videoEl.src = video.src;
                          videoEl.play();
                        }
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium truncate">{video.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{video.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No videos found. Upload some videos to get started!
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Upload Video</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {uploadSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Upload successful!</h3>
                  <p className="mt-2 text-sm text-gray-500">Your video has been uploaded successfully.</p>
                </div>
              ) : (
                <VideoUpload 
                  isPublic={activeCategory === 'interesting'} 
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery; 