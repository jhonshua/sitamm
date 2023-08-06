// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { getUser } from '@src/views/apps/user/store'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, Eye } from 'react-feather'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

// ** Renders Client Columns
const renderClient = row => {
  if (row.avatar?.length) {
    return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
  } else {
    return (
      <Avatar
        initials
        className='me-1'
        content={row.fullName || 'John Doe'}
        color={row.avatarColor || 'light-primary'}
      />
    )
  }
}

// ** Renders Role Columns
const renderRole = row => {
  const roleObj = {
    subscriber: {
      class: 'text-primary',
      icon: User,
    },
    maintainer: {
      class: 'text-success',
      icon: Database,
    },
    editor: {
      class: 'text-info',
      icon: Edit2,
    },
    author: {
      class: 'text-warning',
      icon: Settings,
    },
    admin: {
      class: 'text-danger',
      icon: Slack,
    },
  }

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2

  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Icon
        size={18}
        className={`${roleObj[row.role] ? roleObj[row.role].class : ''} me-50`}
      />
      {row.role}
    </span>
  )
}

const statusObj = {
  0: 'light-warning',
  1: 'light-success',
  2: 'light-secondary',
}

export const columns = [
  {
    name: 'Nombre',
    sortable: false,
    minWidth: '297px',
    sortField: 'fullName',
    selector: row => row.fullName,
    cell: row => <span className='text-capitalize'>{row.full_name}</span>,
  },
  {
    name: 'Rol asignado',
    minWidth: '230px',
    sortable: false,
    sortField: 'rol_id',
    selector: row => row.rol.name,
    cell: row => <span className='text-capitalize'>{row.rol.name}</span>,
  },
  {
    name: 'Status',
    minWidth: '138px',
    sortable: false,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status === 0
          ? 'Pendiente'
          : row.status === 1
          ? 'Activo'
          : 'Inactivo'}
      </Badge>
    ),
  },
  //,
  // {
  //   name: 'Acciones',
  //   minWidth: '100px',
  //   cell: row => (
  //     <Link to={`/apps/user/view/${row.id}`}>
  //       <Eye className='font-medium-3 text-body' />
  //     </Link>
  //   )
  // }
]
