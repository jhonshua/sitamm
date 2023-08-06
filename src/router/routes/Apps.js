// ** React Imports

import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Calendar = lazy(() => import('../../views/apps/calendar'))
const InvoiceAdd = lazy(() => import('../../views/apps/invoice/add'))
const InvoiceList = lazy(() => import('../../views/apps/invoice/list'))
const InvoiceEdit = lazy(() => import('../../views/apps/invoice/edit'))
const InvoicePrint = lazy(() => import('../../views/apps/invoice/print'))
const InvoicePreview = lazy(() => import('../../views/apps/invoice/preview'))
const UserList = lazy(() => import('../../views/apps/user/list'))
const UserView = lazy(() => import('../../views/apps/user/view'))
const Roles = lazy(() => import('../../views/apps/roles-permissions/roles'))
const Permissions = lazy(() =>
  import('../../views/apps/roles-permissions/permissions')
)
const CompaniesList = lazy(() => import('../../views/apps/companies'))
const EmployeesList = lazy(() => import('../../views/apps/employees/list'))
const EmployeesFiles = lazy(() => import('../../views/apps/employees/files'))
const LoansList = lazy(() => import('../../views/apps/loans'))
const Payments = lazy(() => import('../../views/apps/payments'))
const Plans = lazy(() => import('../../views/apps/plans'))
const BeneficiaryList = lazy(() =>
  import('../../views/asismed/beneficiary/list')
)
const Beneficios = lazy(() => import('../../views/beneficios/list'))
const BenefitCategory = lazy(() => import('../../views/beneficios/category'))
const AppRoutes = [
  {
    element: <Calendar />,
    path: '/apps/calendar',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <InvoiceList />,
    path: '/apps/invoice/list',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <InvoicePreview />,
    path: '/apps/invoice/preview/:id',
    meta: {
      publicRoute: false,
    },
  },
  {
    path: '/apps/invoice/preview',
    element: <Navigate to='/apps/invoice/preview/4987' />,
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <InvoiceEdit />,
    path: '/apps/invoice/edit/:id',
    meta: {
      publicRoute: false,
    },
  },
  {
    path: '/apps/invoice/edit',
    element: <Navigate to='/apps/invoice/edit/4987' />,
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <InvoiceAdd />,
    path: '/apps/invoice/add',
    meta: {
      publicRoute: false,
    },
  },
  {
    path: '/apps/invoice/print',
    element: <InvoicePrint />,
    meta: {
      layout: 'blank',
    },
  },
  {
    element: <CompaniesList />,
    path: '/apps/companies',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <EmployeesList />,
    path: '/apps/employees/list',
    meta: {
      action: 'get',
      resource: 'companies',
      publicRoute: false,
    },
  },
  {
    element: <EmployeesFiles />,
    path: '/apps/employees/files',
    meta: {
      action: 'get',
      resource: 'companies',
      publicRoute: false,
    },
  },
  {
    element: <LoansList />,
    path: '/apps/loans',
    meta: {
      action: 'get',
      resource: 'companies',
      publicRoute: false,
    },
  },
  {
    element: <UserList />,
    path: '/apps/user/list',
    meta: {
      publicRoute: false,
    },
  },
  {
    path: '/apps/user/view',
    element: <Navigate to='/apps/user/view/1' />,
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <UserView />,
    path: '/apps/user/view/:id',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <Roles />,
    path: '/apps/roles',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <Permissions />,
    path: '/apps/permissions',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <Payments />,
    path: '/apps/payments/list',
    meta: {
      action: 'get',
      resource: 'companies',
      publicRoute: false,
    },
  },
  {
    element: <Plans />,
    path: '/apps/plans/list',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <BeneficiaryList />,
    path: '/apps/beneficiary/list',
    meta: {
      publicRoute: false,
    },
  },
  {
    element: <Beneficios />,
    path: '/apps/beneficios/list',
    meta: {
      action: 'get',
      resource: 'companies',
      publicRoute: false,
    },
  },
  {
    element: <BenefitCategory />,
    path: '/apps/beneficios/category',
    meta: {
      action: 'get',
      resource: 'companies',
      publicRoute: false,
    },
  },
]

export default AppRoutes