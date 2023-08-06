// ** Icons Import
import {
  Briefcase,
  Calendar,
  FileText,
  Circle,
  CheckCircle,
  User,
  Shield,
  Users,
  DollarSign,
  Airplay,
  Heart,
} from 'react-feather'

export default [
  {
    header: 'Principal',
  },
  // {
  //   id: 'calendar',
  //   title: 'Calendar',
  //   icon: <Calendar size={20} />,
  //   navLink: '/apps/calendar',
  // },
  {
    id: 'payments',
    title: 'Dispersiones',
    icon: <DollarSign size={20} />,
    navLink: '/apps/payments/list',
    action: 'get',
    resource: 'companies',
  },
  {
    id: 'plans',
    title: 'Planes',
    icon: <Airplay size={20} />,
    navLink: '/apps/plans/list',
  },
  // {
  //   id: 'invoiceApp',
  //   title: 'Invoice',
  //   icon: <FileText size={20} />,
  //   children: [
  //     {
  //       id: 'invoiceList',
  //       title: 'List',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/list',
  //     },
  //     {
  //       id: 'invoicePreview',
  //       title: 'Preview',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/preview',
  //     },
  //     {
  //       id: 'invoiceEdit',
  //       title: 'Edit',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/edit',
  //     },
  //     {
  //       id: 'invoiceAdd',
  //       title: 'Add',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/invoice/add',
  //     },
  //   ],
  // },

  {
    id: 'companies',
    title: 'Empresa',
    icon: <Briefcase />,
    navLink: '/apps/companies',
  },
  {
    id: 'employeesApp',
    title: 'Afiliado',
    icon: <Users />,
    children: [
      {
        id: 'employeesList',
        title: 'Lista de Afiliados',
        icon: <Circle size={12} />,
        navLink: '/apps/employees/list',
        action: 'get',
        resource: 'companies',
      },
      {
        id: 'employeesFiles',
        title: 'Archivos',
        icon: <Circle size={12} />,
        navLink: '/apps/employees/files',
        action: 'get',
        resource: 'companies',
      },
    ],
  },
  {
    id: 'loans',
    title: 'Prestamos',
    icon: <DollarSign />,
    navLink: '/apps/loans',
    action: 'get',
    resource: 'companies',
  },
  {
    id: 'roles-permissions',
    title: 'Roles',
    icon: <Shield size={20} />,
    children: [
      {
        id: 'roles',
        title: 'Roles',
        icon: <Circle size={12} />,
        navLink: '/apps/roles',
      },
      {
        id: 'permissions',
        title: 'Permisos',
        icon: <Circle size={12} />,
        navLink: '/apps/permissions',
      },
    ],
  },

  {
    id: 'users',
    title: 'Usuarios',
    icon: <User size={20} />,
    children: [
      {
        id: 'list',
        title: 'Lista',
        icon: <Circle size={12} />,
        navLink: '/apps/user/list',
      },
      //   {
      //     id: 'view',
      //     title: 'View',
      //     icon: <Circle size={12} />,
      //     navLink: '/apps/user/view'
      //   }
    ],
  },
  {
    header: 'ASISMED',
  },
  {
    id: 'beneficiarios',
    title: 'Beneficiarios',
    icon: <Heart size={20} />,
    children: [
      {
        id: 'lista',
        title: 'Lista',
        icon: <Circle size={12} />,
        navLink: '/apps/beneficiary/list',
      },
    ],
    //   navLink: '/apps/asismed/beneficiary'
  },
  {
    id: 'beneficio',
    title: 'Beneficio',
    icon: <CheckCircle size={20} />,
    children: [
      {
        id: 'category',
        title: 'Categorias',
        icon: <Circle size={12} />,
        navLink: '/apps/beneficios/category',
        action: 'get',
        resource: 'companies',
      },
      {
        id: 'lista',
        title: 'Lista',
        icon: <Circle size={12} />,
        navLink: '/apps/beneficios/list',
        action: 'get',
        resource: 'companies',
      },
      {
        header: '',
      },
      {
        header: '',
      },
    ],
    //   navLink: '/apps/asismed/beneficiary'
  },
  {
    header: '',
  },
  {
    header: '',
  },
]
