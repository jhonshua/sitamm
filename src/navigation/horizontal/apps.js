// ** Icons Import
import {
  Box,
  Calendar,
  Circle,
  FileText,
  Shield,
  User,
  DollarSign
} from 'react-feather'

export default [
  {
    id: 'apps',
    title: 'Apps',
    icon: <Box />,
    children: [
      {
        id: 'calendar',
        title: 'Calendar',
        icon: <Calendar />,
        navLink: '/apps/calendar'
      },
      {
        id: 'payments',
        title: 'Payments',
        icon: <DollarSign size={20}/>,
        navLink: '/apps/payments/list'
      },
      {
        id: 'invoiceApp',
        title: 'Invoice',
        icon: <FileText />,
        children: [
          {
            id: 'invoiceList',
            title: 'List',
            icon: <Circle />,
            navLink: '/apps/invoice/list'
          },
          {
            id: 'invoicePreview',
            title: 'Preview',
            icon: <Circle />,
            navLink: '/apps/invoice/preview'
          },
          {
            id: 'invoiceEdit',
            title: 'Edit',
            icon: <Circle />,
            navLink: '/apps/invoice/edit'
          },
          {
            id: 'invoiceAdd',
            title: 'Add',
            icon: <Circle />,
            navLink: '/apps/invoice/add'
          }
        ]
      },
      {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        icon: <Shield size={20} />,
        children: [
          {
            id: 'roles',
            title: 'Roles',
            icon: <Circle size={12} />,
            navLink: '/apps/roles'
          },
          {
            id: 'permissions',
            title: 'Permissions',
            icon: <Circle size={12} />,
            navLink: '/apps/permissions'
          }
        ]
      },
      {
        id: 'users',
        title: 'User',
        icon: <User />,
        children: [
          {
            id: 'list',
            title: 'List',
            icon: <Circle />,
            navLink: '/apps/user/list'
          },
          {
            id: 'view',
            title: 'View',
            icon: <Circle />,
            navLink: '/apps/user/view'
          }
        ]
      }
    ]
  }
]
