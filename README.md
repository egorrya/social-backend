# Social Backend

This is the backend server for the Social application. It provides API endpoints for managing posts, comments, likes, and notifications.

## **Development Environment Setup**

1. Create a file named **`.env`** in the root directory of your project.
2. Open the **`.env`** file and add the following environment variables:Replace **`<your MongoDB URI>`**, **`<your secret key>`**, **`<your Cloudinary name>`**, **`<your Cloudinary API key>`**, and **`<your Cloudinary API secret>`** with your actual values.

   ```
   MONGODB_URI=<your MongoDB URI>
   SECRET_KEY=<your secret key>
   CLOUDINARY_NAME=<your Cloudinary name>
   CLOUDINARY_API_KEY=<your Cloudinary API key>
   CLOUDINARY_API_SECRET=<your Cloudinary API secret>
   ```

## **Running the Application**

1. Install the required dependencies by running the following command in your terminal:

   ```
   npm install
   ```

2. Start the development server by running the following command:

   ```
   npm run dev
   ```

   This will use **`nodemon`** to automatically restart the server whenever changes are made to the code.

3. Open your browser and visit **`http://localhost:3000`** to access the application in the development environment.

## **Deployment**

The application is live on **[https://social-backend-iota.vercel.app/](https://social-backend-iota.vercel.app/)**. To deploy the application, follow these steps:

1. Update the necessary environment variables in your deployment environment or platform with the corresponding values.
2. Build and start the application by running the following command:

   ```
   npm start
   ```

3. The application will be accessible at the specified deployment URL.

# API Documentation

# Social Backend

This is the backend server for the Social application. It provides API endpoints for managing posts, comments, likes, and notifications.

## Welcome, Space Cowboy!

- **URL:** `{{ _.base_path }}/`
- **Method:** GET
- **Description:** Retrieves a welcome message for space cowboys.

## Register

- **URL:** `{{ _.base_path }}/auth/register`
- **Method:** POST
- **Description:** Registers a new user.
- **Body:**

  ```
  {
    "email": "test4@test.com",
    "password": "123456",
    "username": "test4"
  }

  ```

- **Headers:**
  - Content-Type: application/json

## Login

- **URL:** `{{ _.base_path }}/auth/login`
- **Method:** POST
- **Description:** Logs in a user.
- **Body:**

  ```
  {
    "email": "test@test.com",
    "password": "123456"
  }

  ```

- **Headers:**
  - Content-Type: application/json

## Change Profile

- **URL:** `{{ _.base_path }}/users/changeProfile`
- **Method:** POST
- **Description:** Updates the user's profile.
- **Body:**

  ```
  {
    "username": "test10"
  }

  ```

- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Get Me

- **URL:** `{{ _.base_path }}/auth/me`
- **Method:** GET
- **Description:** Retrieves the user's profile.
- **Headers:**
  - Authorization: Bearer [token]

## Get All Users

- **URL:** `{{ _.base_path }}/users/`
- **Method:** GET
- **Description:** Retrieves all users.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Get One User

- **URL:** `{{ _.base_path }}/users/62f445749c1ca951ce4ca954`
- **Method:** GET
- **Description:** Retrieves a specific user.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Toggle Follow

- **URL:** `{{ _.base_path }}/follow/`
- **Method:** POST
- **Description:** Toggles the follow status for a user.
- **Body:**

  ```
  {
    "id": "63f148b6db4738dc32a26bbc"
  }

  ```

- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Following List

- **URL:** `{{ _.base_path }}/follow`
- **Method:** GET
- **Description:** Retrieves the list of users being followed.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]
- **Parameters:**
  - type: following
  - username: test

## Followers List

- **URL:** `{{ _.base_path }}/follow/followers`
- **Method:** GET
- **Description:** Retrieves the list of followers.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]
- **Parameters:**
  - username: test

## Get Posts

- **URL:** `{{ _.base_path }}/posts`
- **Method:** GET
- **Description:** Retrieves all posts.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]
- **Parameters:**
  - page: 1
  - filter: user_posts
  - limit:

10

- likes: 1
- sort: desc
- username: test
- before: 2023-01-01

## Get One Post

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958`
- **Method:** GET
- **Description:** Retrieves a specific post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Create Post

- **URL:** `{{ _.base_path }}/posts`
- **Method:** POST
- **Description:** Creates a new post.
- **Headers:**
  - Content-Type: multipart/form-data
  - Authorization: Bearer [token]
- **Body:**
  - text: Sample post text
  - image: [file]

## Update Post

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958`
- **Method:** PATCH
- **Description:** Updates an existing post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]
- **Body:**

  ```
  {
    "text": "Updated post content"
  }

  ```

## Delete Post

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958`
- **Method:** DELETE
- **Description:** Deletes a post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Get All Comments

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958/comments`
- **Method:** GET
- **Description:** Retrieves all comments for a specific post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Create Comment

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958/comment`
- **Method:** POST
- **Description:** Creates a new comment on a post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]
- **Parameters:**
  - postId: 62f3c0a29c1ca951ce4ca958
- **Body:**

  ```
  {
    "text": "Sample comment"
  }

  ```

## Get All Likes

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958/likes`
- **Method:** GET
- **Description:** Retrieves all likes for a specific post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]

## Toggle Like

- **URL:** `{{ _.base_path }}/posts/62f3c0a29c1ca951ce4ca958/like`
- **Method:** POST
- **Description:** Toggles the like status for a post.
- **Headers:**
  - Content-Type: application/json
  - Authorization: Bearer [token]
