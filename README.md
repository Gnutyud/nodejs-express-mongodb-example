# Node.js Express MongoDB Example Project

This is an example Node.js project that uses the Express framework and MongoDB. It includes configurations for CORS options, authentication with refresh tokens and HTTP-only cookies, and API endpoints for users and file uploads.

## Table of Contents

- [Node.js Express MongoDB Example Project](#nodejs-express-mongodb-example-project)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [File Upload](#file-upload)

## Installation

To install this project, clone the repository and run the following command: 
`npm install`
This will install all the necessary dependencies.

## Usage

To start the application, run the following command:
`npm start`

The application will then be accessible at `http://localhost:5000/`.

## API Endpoints

The following API endpoints are available in this project:

| Method | Endpoint | Description | Parameters | Authentication |
| -------- | -------- | ----------- | ---------- | ---------- |
| POST | `/api/v1/auth` | Login | (username, password) | No |
| POST | `/api/v1/auth/signup` | Create a new user | User information (username, email, password) | No |
| POST | `/api/v1/auth/logout` | Logout | None | Required |
| GET | `/api/v1/auth/refresh` | Refresh token | None | Required |
| GET | `/api/v1/users` | Get a list of all users | None | No |
| GET | `/api/v1/users/:username` | Get information about a specific user | User name | No |
| PATCH | `/api/v1/users` | Update a user's information | updated information (username, email, password, avatar, status) | Required |
| DELETE | `/api/v1/users` | Delete a user | None | Required |
| POST | `/api/v1/upload/image` | Upload a file | File to be uploaded | No |

## Authentication

Authentication is handled using cookies and JWT tokens. When a user logs in, a JWT token is generated and stored in a cookie with the `httpOnly` flag set to `true`. This token is used to authenticate subsequent requests to protected endpoints.

## File Upload

File uploads are handled using the `multer` middleware. Uploaded files are stored on the server's file system, and their metadata is saved to a MongoDB collection for later retrieval.

