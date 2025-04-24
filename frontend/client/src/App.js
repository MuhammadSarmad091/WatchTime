import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import React from 'react';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
// import TMDBMovieDetails from './pages/TMDBMovieDetails';
// import NotFound from './pages/not-found';

function Router() {
  return React.createElement(
    Switch,
    null,
    React.createElement(Route, { path: "/", component: HomePage }),
    React.createElement(Route, { path: "/login", component: LoginPage }),
    React.createElement(Route, { path: "/signup", component: SignupPage }),
    React.createElement(Route, { path: "/movies", component: MoviesPage }),
    React.createElement(Route, { path: "/movie/:id", component: MovieDetailsPage }),
    React.createElement(Route, { path: "/profile", component: ProfilePage }),
    React.createElement(Route, { path: "/admin", component: AdminPanel }),
    // React.createElement(Route, { path: "/tmdb/movie/:id", component: TMDBMovieDetails }),
    // React.createElement(Route, { component: NotFound })
  );
}

function App() {
  return React.createElement(
    QueryClientProvider, 
    { client: queryClient },
    React.createElement(
      TooltipProvider,
      null,
      React.createElement(
        AuthProvider,
        null,
        React.createElement(Toaster, null),
        React.createElement(ToastContainer, { position: "top-right", autoClose: 5000 }),
        React.createElement(Router, null)
      )
    )
  );
}

export default App;