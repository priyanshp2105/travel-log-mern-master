# Travel Log MERN

## Personal Statement

As an aspiring graduate student in Computer Science, I built Travel Log to demonstrate my ability to design, implement, and document a robust full-stack application. This project reflects my passion for both technology and user-centric design, and my commitment to building real-world solutions that help people capture and relive their experiences. Through this project, I challenged myself to integrate authentication, file uploads, secure APIs, and a modern, responsive UI—all skills I am eager to deepen at Northeastern University.

---

## Features

- User registration and authentication (JWT-based)
- Add, edit, delete, and view travel stories
- Upload and manage images for each story
- Mark stories as favorite
- Search and filter stories by keyword or date range
- Responsive, modern UI with React and Tailwind CSS

---

## Technical Highlights & Challenges

- **Authentication & Security:** Implemented JWT-based authentication and password hashing with bcrypt to ensure user data privacy.
- **RESTful API Design:** Designed modular, secure Express routes for all CRUD operations, image uploads, and search/filter features.
- **File Uploads:** Integrated Multer for secure, efficient image uploads and management.
- **Frontend Architecture:** Used React with Vite for fast development, React Router for navigation, and Tailwind CSS for a clean, responsive UI.
- **State Management:** Leveraged React hooks and local storage for seamless user experience.
- **Error Handling:** Implemented robust error handling on both frontend and backend for reliability.
- **Testing & Linting:** Used ESLint and clear code structure to ensure maintainability and code quality.

---

## Project Structure

```
travel-log-mern-master/
├── backend/                # Node.js/Express backend
│   ├── assests/            # Static assets (images)
│   ├── models/             # Mongoose models (User, TravelStory)
│   ├── uploads/            # Uploaded images
│   ├── config.json         # MongoDB connection string
│   ├── index.js            # Main server file (API routes)
│   ├── multer.js           # Multer config for image uploads
│   ├── utilities.js        # JWT authentication middleware
│   ├── package.json        # Backend dependencies
├── frontend/
│   └── travel-log-app/     # React frontend (Vite + Tailwind)
│       ├── src/
│       │   ├── assets/     # Frontend images
│       │   ├── components/ # Reusable React components
│       │   ├── pages/      # Page components (auth, home, story views)
│       │   ├── utils/      # Helper functions, axios instance
│       │   ├── App.jsx     # Main app component
│       │   └── main.jsx    # Entry point
│       ├── public/         # Static files
│       ├── index.html      # HTML entry
│       ├── tailwind.config.js
│       ├── vite.config.js
│       └── package.json    # Frontend dependencies
```

---

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd travel-log-mern-master/backend
   npm install
   ```
2. **Configure MongoDB:**
   - Edit `config.json` if needed (default: `mongodb://localhost:27017/`).
   - Ensure MongoDB is running locally.
3. **Set environment variables:**
   - Create a `.env` file in `backend/` with:
     ```
     ACCESS_TOKEN_SECRET=your_jwt_secret
     ```
4. **Start the backend server:**
   ```bash
   npm start
   ```
   - Server runs on [http://localhost:8000](http://localhost:8000)

---

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd travel-log-mern-master/frontend/travel-log-app
   npm install
   ```
2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   - App runs on [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## Usage

- Register a new account or log in.
- Add, edit, delete, and view your travel stories.
- Upload images for each story.
- Mark stories as favorite, search, and filter by date.

---

## API Endpoints (Backend)

- `POST   /create-account` — Register a new user
- `POST   /login` — User login
- `GET    /get-user` — Get current user info (auth required)
- `POST   /image-upload` — Upload an image
- `DELETE /delete-image` — Delete an uploaded image
- `POST   /add-travel-story` — Add a new travel story (auth required)
- `GET    /get-all-stories` — Get all stories for user (auth required)
- `PUT    /edit-story/:id` — Edit a travel story (auth required)
- `DELETE /delete-story/:id` — Delete a travel story (auth required)
- `PUT    /update-is-favourite/:id` — Mark/unmark as favorite (auth required)
- `GET    /search?query=...` — Search stories (auth required)
- `GET    /travel-stories/filter?startDate=...&endDate=...` — Filter stories by date (auth required)

---

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router, React Icons, React Toastify, Moment.js
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Multer, CORS, Dotenv

---

## Why I Built This

I created Travel Log to combine my passion for travel and technology, and to demonstrate my skills in full-stack web development. This project showcases my ability to design, build, and document a complete MERN application with authentication, file uploads, and a modern UI. It also reflects my interest in building tools that help people capture and relive their experiences.

---

## What I Learned

- Deepened my understanding of secure authentication and RESTful API design.
- Improved my skills in React, state management, and responsive UI design.
- Learned to integrate file uploads and manage static assets securely.
- Practiced writing clean, maintainable, and well-documented code.
- Gained experience in debugging, error handling, and user experience design.

---

## Future Improvements

- Deploy the app to a cloud platform for public access
- Add user profile pictures and social features
- Integrate a map view for visited locations
- Add support for multiple image uploads per story
- Implement password reset and email verification
- Add unit and integration tests for backend and frontend
- Improve accessibility and add dark mode

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
