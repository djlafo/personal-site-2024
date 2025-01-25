import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Home, Error, Interval, Weather, Linux, Visualizer } from './pages';

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
    {
      path: '/Visualizer',
      element: <Visualizer/>
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
