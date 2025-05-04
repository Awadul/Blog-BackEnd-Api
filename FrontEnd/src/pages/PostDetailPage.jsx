import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import placeholderImage from '../assets/placeholder-image.png'; // Assuming you have this

function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null); // To store fetched author details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch the main post data
        const postResponse = await fetch(`http://localhost:3000/api/posts/${postId}`);
        if (!postResponse.ok) {
          throw new Error(`Failed to fetch post (status: ${postResponse.status})`);
        }
        const postData = await postResponse.json();
        
        // Backend seems to return an array, take the first element
        const mainPostData = Array.isArray(postData) ? postData[0] : postData;

        if (!mainPostData) {
          throw new Error('Post not found');
        }
        setPost(mainPostData);

        // Fetch author details if createdBy exists
        if (mainPostData.createdBy) {
          try {
            // Assuming an endpoint like /user/profile/:userId exists or similar
            // We'll simulate fetching user details for now, replace with actual endpoint
            const userResponse = await fetch(`http://localhost:3000/user/profile/${mainPostData.createdBy}`); // Placeholder endpoint
             if (userResponse.ok) {
               const userData = await userResponse.json();
               setAuthor(userData); // Adjust based on actual API response structure
             } else {
                console.warn('Could not fetch author details.')
                setAuthor({ name: 'Unknown Author' }); // Fallback
             }
          } catch (userError) {
              console.error('Error fetching author details:', userError);
              setAuthor({ name: 'Unknown Author' }); // Fallback
          }
        } else {
           setAuthor({ name: 'Unknown Author' }); // Fallback if no createdBy
        }

      } catch (err) {
        console.error('Error fetching post details:', err);
        setError(err.message || 'Failed to load post details.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-2xl text-red-600 mb-4">Error loading post</p>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!post) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-2xl text-gray-600 mb-6">Post not found.</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    );
  }
  
  // NOTE: The provided data sample doesn't include 'title' or 'content'. 
  // These fields need to be added to the backend model and returned by the API.
  // We'll include placeholders for them here.

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-80 bg-gray-200">
          <img 
            src={post.cover || placeholderImage} 
            alt={post.title || post.tagLine || 'Post cover image'} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = placeholderImage; }}
          />
        </div>

        <article className="p-6 md:p-10">
          {/* Post Header */}
          <header className="mb-6 border-b border-gray-200 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {post.title || post.tagLine || "Post Detail"}
            </h1>
            <p className="text-lg text-gray-600 italic">
              {post.title ? post.tagLine : ""}
            </p>
            <div className="mt-4 text-sm text-gray-500 flex items-center space-x-4">
               <span>By {author?.name || post.createdBy || 'Unknown User ID'}</span> 
               <span className="text-gray-300">|</span>
               <span>Published on {formattedDate}</span>
            </div>
             {post.createdAt !== post.updatedAt && (
                <p className="mt-1 text-xs text-gray-400">
                  Last updated: {new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
             )}
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none text-gray-800">
             {/* Use prose class for nice typography defaults if using Tailwind Typography plugin */}
            <p>
              {post.content || "This post currently has no content. Please update it in the backend."} {/* Placeholder */}
            </p>
            {/* Add more content rendering here if needed */}
          </div>
        </article>
      </div>
      
      <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 hover:underline">
              &larr; Back to all posts
          </Link>
      </div>
    </div>
  );
}

export default PostDetailPage; 