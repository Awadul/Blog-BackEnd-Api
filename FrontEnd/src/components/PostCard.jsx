import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import placeholderImage from '../assets/placeholder-image.png'

function PostCard({ post }) {
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Destructure post data with field names matching the backend model
  const { 
    _id, 
    title,
    tagLine,
    cover,
    createdAt,
    createdBy
  } = post || {}

  const imageUrl = cover; // Backend provides the direct URL

  // Format date
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : ''
    
  const handleCardClick = () => {
    // Correct: Navigate to the FRONTEND route defined in App.jsx
    navigate(`/api/posts/${_id}`);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <div 
      onClick={handleCardClick}
      // Use more rounded corners (rounded-xl)
      className="bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-gray-200"> {/* Fixed height, gray background for loading/error */}
        {/* Loading Indicator */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Image or Error/Placeholder Indicator */}
        <img 
          src={imageError || !imageUrl ? placeholderImage : imageUrl}
          alt={title || 'Blog post image'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Show "No Image" text if error occurred and it's not the placeholder */}
        {imageError && imageUrl && (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
             <p className="text-white text-sm font-semibold">Image unavailable</p>
           </div>
        )}
        {!imageUrl && !isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50">
            <p className="text-white text-xs font-semibold">No Image Provided</p>
          </div>
        )}
      </div>
      
      {/* Content area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title with tagline underneath */}
        <h3 className="text-base font-semibold mb-1 truncate" title={title}>
          {title || "Untitled Post"}
        </h3>
        
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow">
          {tagLine || "No tagline"}
        </p>
        
        {/* Footer with date and author */}
        <div className="flex justify-between items-center mt-auto pt-2 text-xs text-gray-500 border-t border-gray-100">
          <span className="truncate" title={createdBy || 'Unknown Author'}>By {createdBy || 'Unknown User ID'}</span>
          <span className="flex-shrink-0">{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard     