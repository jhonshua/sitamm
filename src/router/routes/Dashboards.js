import { lazy } from 'react'

const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))

const DashboardRoutes = [
  {
    path: '/dashboard',
    element: <DashboardEcommerce />,
    meta: {
      action: 'read',
      resource: 'dashboard',
      publicRoute: false
    }
  }
]

export default DashboardRoutes
