import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Home, Error, Interval, Weather, Linux } from './pages';

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
