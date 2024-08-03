import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Home, Error, Interval, Contact, Weather } from './pages';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>,
      errorElement: <Error/>,
    },
    {
      path: '/Interval',
      element: <Interval/>,
    },
    {
      path: '/Contact',
      element: <Contact/>,
    },
    {
      path: '/Weather',
      element: <Weather/>
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
