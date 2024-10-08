import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import HomePage from './pages/HomePage'
import MainLayout from './layouts/MainLayout'
import JobsPage from './pages/JobsPage'
import NotFoundPage from './pages/NotFoundPage'
import JobPage, { jobLoader } from './pages/JobPage'
import AddJobPage from './pages/AddJobPage'
import base from './constants';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={base + '/'} element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path={base + '/jobs'} element={<JobsPage />} />
      <Route path={base + '/jobs/:id'} element={<JobPage />} loader={jobLoader} />
      <Route path={base + '/add-job'} element={<AddJobPage />} />
      <Route path='*' element={<NotFoundPage />} />
      
    </Route>
  )
)

const App = () => {
  return (
    <RouterProvider router={router} />
    // <>
    
    //   <Navbar />
    //   <Hero />
    //   <HomeCards />
    //   <JobListings />
    //   <ViewAllJobs />
    // </>
  )
}

export default App