# Blog Backend API Documentation

## Overview
This is the backend API for the Blog application, built with Express.js and MongoDB. The API provides endpoints for user management, post creation, and review functionality.

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Multer for file uploads

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation
1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd BackEnd
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on port 3000 by default.

## API Endpoints

### User Routes (`/user`)

#### Register User
- **POST** `/user/register`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with JWT token

#### Login User
- **POST** `/user/login`
- **Description**: Login existing user
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object with JWT token

#### Get User Profile
- **GET** `/user/profile`
- **Description**: Get current user's profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile object

### Post Routes (`/post`)

#### Create Post
- **POST** `/post`
- **Description**: Create a new blog post
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "image": "file" // optional
  }
  ```
- **Response**: Created post object

#### Get All Posts
- **GET** `/post`
- **Description**: Get all blog posts
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Posts per page (default: 10)
- **Response**: Array of post objects

#### Get Single Post
- **GET** `/post/:id`
- **Description**: Get a specific blog post
- **Parameters**: Post ID
- **Response**: Post object

#### Update Post
- **PUT** `/post/:id`
- **Description**: Update an existing post
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: Post ID
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "image": "file" // optional
  }
  ```
- **Response**: Updated post object

#### Delete Post
- **DELETE** `/post/:id`
- **Description**: Delete a post
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: Post ID
- **Response**: Success message

### Review Routes

#### Add Review
- **POST** `/post/:postId/review`
- **Description**: Add a review to a post
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: Post ID
- **Body**:
  ```json
  {
    "rating": "number",
    "comment": "string"
  }
  ```
- **Response**: Created review object

## Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  content: String,
  image: String (URL),
  author: ObjectId (ref: User),
  reviews: [ObjectId (ref: Review)],
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  rating: Number,
  comment: String,
  user: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security
- JWT-based authentication
- Password hashing using bcrypt
- CORS enabled
- Cookie-based session management

## File Upload
- Supports image uploads for posts
- Uses Cloudinary for image storage
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF

## Rate Limiting
Currently, there is no rate limiting implemented. Consider implementing rate limiting for production use.

## Future Improvements
1. Add input validation
2. Implement rate limiting
3. Add API documentation with Swagger
4. Add unit and integration tests
5. Implement caching
6. Add logging system
7. Add health check endpoints 