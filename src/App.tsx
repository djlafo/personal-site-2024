import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Home, Error, Interval, Contact, Weather, Linux } from './pages';

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
    {
      path: '/Linux',
      element: <Linux/>
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
