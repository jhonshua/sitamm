// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { activarUser, desactiveUser, deleteUser, setUser } from '../store'

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
  MinusSquare,
  PlusSquare,
  Trash2,
  Archive,
} from 'react-feather'

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

// ** Renders Client Columns
const renderClient = row => {
  if (row.avatar?.length) {
    return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
  } else {
    return (
      <Avatar
        initials
        className='me-1'
        color={row.avatarColor || 'light-primary'}
        content={row.full_name || row.username || 'John Doe'}
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

export const filterObj = {
  rol_id: null,
  status: null,
}

export const aFilters = [
  {
    label: 'Rol',
    name: 'rol_id',
    type: 'select',
  },
  {
    label: 'Estatus',
    name: 'status',
    type: 'select',
  },
  {
    label: 'Nombre y Correo',
    name: 'full_name,email',
    or: true,
  },
]

const statusObj = {
  0: 'light-primary',
  1: 'light-success',
  2: 'light-secondary',
}

export const columns = toggle => [
  {
    name: 'Nombre de usuario',
    minWidth: '250px',
    sortable: false,
    sortField: 'currentPlan',
    selector: row => row.full_name,
    cell: row => <span className='text-capitalize'>{row.full_name}</span>,
  },
  {
    name: 'correo electrónico',
    minWidth: '280px',
    sortable: false,
    sortField: 'currentPlan',
    selector: row => row.full_name,
    cell: row => <span className='text'>{row.email}</span>,
  },
  {
    name: 'Rol',
    minWidth: '230px',
    sortable: false,
    sortField: 'rol_id',
    selector: row => row.rol.name,
    cell: row => <span className='text-capitalize'>{row.rol.name}</span>,
  },
  {
    name: 'Estatus',
    minWidth: '138px',
    sortable: false,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status === 0
          ? 'Inactivo'
          : row.status === 1
          ? 'Activo'
          : 'Pendiente'}
      </Badge>
    ),
  },
  {
    name: 'Acciones',
    minWidth: '100px',
    cell: row => (
      <div className='column-action'>
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setUser(row))
                toggle()
              }}>
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Editar</span>
            </DropdownItem>

            {row.status === 1 ? (
              <DropdownItem
                tag='a'
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(desactiveUser(row._id))
                }}>
                <MinusSquare size={17} className='me-50' />
                <span className='align-middle'>Desactivar</span>
              </DropdownItem>
            ) : row.status === 0 ? (
              <DropdownItem
                tag='a'
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(activarUser(row._id))
                }}>
                <PlusSquare size={20} className='me-50' />
                <span className='align-middle'>Activar</span>
              </DropdownItem>
            ) : (
              <></>
            )}
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(deleteUser(row.id))
              }}>
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>Eliminar</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
]
