# My Blog - Backend

This is the backend service for the My Blog application, providing APIs for user authentication, post management, reviews, and image uploads.

## Features

*   **User Authentication:** User registration and login using JWT (stored in HTTP-only cookies).
*   **Post Management:** Create, read posts (feed and individual).
*   **Review Management:** Add, read, update, and delete reviews on posts.
*   **Image Uploads:** Handles cover image uploads for posts using Multer and Cloudinary.
*   **Protected Routes:** Middleware verifies user authentication for protected actions.

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Authentication:** JSON Web Tokens (JWT), bcrypt (for password hashing)
*   **Image Storage:** Cloudinary
*   **File Uploads:** Multer
*   **Middleware:** CORS, cookie-parser
*   **Development:** Nodemon

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-based like MongoDB Atlas)
*   Cloudinary account (for API Key, Secret, and Cloud Name)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd My-Blog/BackEnd
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `BackEnd` directory and add the following variables:

    ```dotenv
    MONGO_URL=<your_mongodb_connection_string>
    JWT_SECRET=<your_strong_jwt_secret>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    # Optional: Specify a port if different from 3000
    # PORT=3000
    ```

## Running the Application

*   **Development Mode (with auto-reload):**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server will typically start on `http://localhost:3000` (or the port specified in `.env`).

*   **Production Mode (requires a build step if applicable, or just run directly):**
    ```bash
    node index.js
    ```

## API Endpoints

The base URL is typically `http://localhost:3000`.

### User Routes (`/user`)

*   **`POST /user/register`**: Register a new user.
    *   Body: `{ "userName": "string", "email": "string", "password": "string" }`
*   **`POST /user/login`**: Log in a user.
    *   Body: `{ "email": "string", "password": "string" }`
    *   Sets an HTTP-only cookie (`token`) upon success.
*   **`GET /user/dashboard`**: Get dashboard info for the authenticated user.
    *   Requires authentication (valid `token` cookie).
*   **`POST /user/logout`** (Assumed - often implemented, check `user.controller.js`): Logs out the user.
    *   Clears the `token` cookie.

### Post Routes (`/post`)

*   **`POST /post/posts`**: Create a new post.
    *   Requires authentication.
    *   Expects `multipart/form-data`.
    *   Fields: `title` (string), `tagLine` (string), `content` (string), `cover` (file).
*   **`GET /post/posts`**: Get all posts (feed - excludes full content).
*   **`GET /post/posts/:postId`**: Get details of a specific post.
*   **`GET /post/posts/:postId/reviews`**: Get all reviews for a specific post.
*   **`POST /post/posts/:postId/reviews`**: Add a review to a post.
    *   Requires authentication.
    *   Body: `{ "review": "string" }`
*   **`PUT /post/posts/:postId/review/:reviewId`**: Update a specific review owned by the user.
    *   Requires authentication.
    *   Body: `{ "review": "string" }`
*   **`DELETE /post/posts/:postId/reviews/:reviewId`**: Delete a specific review owned by the user.
    *   Requires authentication.

## Project Structure

```
BackEnd/
├── config/                 # Configuration files (DB, Cloudinary, Multer, Auth)
│   ├── ConnectDB.js
│   ├── authJWT.js
│   ├── cloudinaryConfig.js
│   ├── multerFileUpload.js
│   └── verifyAuth.js
├── controllers/            # Request handlers (business logic)
│   ├── post.controller.js
│   ├── review.controller.js # (Assumed for review logic)
│   └── user.controller.js
├── models/                 # Mongoose data models (schema definitions)
│   ├── post.model.js
│   ├── review.model.js
│   └── user.models.js
├── node_modules/           # Project dependencies
├── routes/                 # Express route definitions
│   ├── postRouter.js
│   └── userRouter.js
├── .env                    # Environment variables (create this file)
├── .gitignore              # Git ignore rules
├── index.js                # Main application entry point
├── package-lock.json       # Dependency lock file
├── package.json            # Project metadata and dependencies
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

(Specify your license here, e.g., MIT License) 