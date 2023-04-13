# Node.js Express MongoDB Example Project

This is an example Node.js project that uses the Express framework and MongoDB. It includes configurations for CORS options, authentication with refresh tokens and HTTP-only cookies, and API endpoints for users and file uploads.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install this project, clone the repository and run the following command: 
`npm install`
This will install all the necessary dependencies.

## Usage

To start the application, run the following command:
`npm start`

The application will then be accessible at `http://localhost:3000/`.

## API Endpoints

The following API endpoints are available in this project:

| Endpoint | Description | Parameters |
| -------- | ----------- | ---------- |
| `/users` | Get a list of all users | None |
| `/users/:id` | Get information about a specific user | User ID |
| `/users/create` | Create a new user | User information (name, email, password) |
| `/users/:id/update` | Update a user's information | User ID and updated information |
| `/users/:id/delete` | Delete a user | User ID |
| `/upload` | Upload a file | File to be uploaded |

## Authentication

Authentication is handled using cookies and JWT tokens. When a user logs in, a JWT token is generated and stored in a cookie with the `httpOnly` flag set to `true`. This token is used to authenticate subsequent requests to protected endpoints.

## File Upload

File uploads are handled using the `multer` middleware. Uploaded files are stored on the server's file system, and their metadata is saved to a MongoDB collection for later retrieval.

