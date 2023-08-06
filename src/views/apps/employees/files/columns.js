// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'
import { useSelector } from 'react-redux'
import { deleteEmployee, getEmployee, setEmployee } from '../store'

// ** Icons Imports
import {
  Slack,
  User,
  Settings,
  Database,
  Edit2,
  MoreVertical,
  FileText,
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

const statusObj = {
  0: 'light-warning',
  1: 'light-success',
  2: 'light-secondary',
}

export const columns = toggle => [
  {
    name: 'nombre',
    minWidth: '138px',
    sortable: true,
    sortField: 'name',
    selector: row => row.name,
    cell: row => <span className='text-capitalize'>{row.name}</span>,
  },
  {
    name: 'FOTOGRAFIA',
    minWidth: '138px',
    sortable: false,
    sortField: 'FOTOGRAFIA',
    selector: row => row.selfie_id,
    cell: row => (
      <span className='text-capitalize'>
        {row.selfie_id ? 'FOTOGRAFIA' : 'POR ADJUNTAR'}
      </span>
    ),
  },
  {
    name: 'INE FRENTE',
    minWidth: '138px',
    sortable: false,
    sortField: 'INE FRENTE',
    selector: row => row.ine_front_id,
    cell: row => (
      <span className='text-capitalize'>
        {row.ine_front_id ? 'INE FRENTE' : 'POR ADJUNTAR'}
      </span>
    ),
  },
  {
    name: 'INE REVERSO',
    minWidth: '138px',
    sortable: false,
    sortField: 'INE REVERSO',
    selector: row => row.ine_back_id,
    cell: row => (
      <span className='text-capitalize'>
        {row.ine_back_id ? 'INE REVERSO' : 'POR ADJUNTAR'}
      </span>
    ),
  },
  {
    name: 'COMPROBANTE DE DOMICILIO',
    minWidth: '138px',
    sortable: false,
    sortField: 'COMPROBANTE DE DOMICILIO',
    selector: row => row.proof_of_address_id,
    cell: row => (
      <span className='text-capitalize'>
        {row.proof_of_address_id ? 'COMPROBANTE DE DOMICILIO' : 'POR ADJUNTAR'}
      </span>
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
                store.dispatch(setEmployee(row))
                toggle()
              }}>
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Editar</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(deleteEmployee(row._id))
              }}>
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>Borrar</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
]
