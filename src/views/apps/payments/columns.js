//  import store and dispatch
import { store } from '@store/store'
import { setPayment } from './store/index'

//date dayjs
import dayjs from 'dayjs'

// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Badge,
} from 'reactstrap'

//father icon
import { Edit, MoreVertical } from 'react-feather'

//style status
const statusObj = {
  0: 'light-secondary',
  1: 'light-warning',
  2: 'light-success',
  3: 'light-danger',
}

// ** Table columns
export const columns = toggle => [
  {
    name: 'Nombre',
    sortable: true,
    minWidth: '200px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => {
      const name = row.employees ? row.employees.name : 'Jhon Doe'
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{`${name}`}</h6>
          </div>
        </div>
      )
    },
  },
  {
    name: 'Apellido',
    sortable: true,
    minWidth: '200px',
    sortField: 'lastName',
    selector: row => row.last_name,
    cell: row => {
      const lastName = row.employees
        ? row.employees.last_name
        : 'Rodrigez Montila'
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{`${lastName}`}</h6>
          </div>
        </div>
      )
    },
  },
  {
    name: 'Estatus',
    minWidth: '140px',
    sortable: true,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge
        className='text-capitalize'
        color={statusObj[row.status ? row.status : 0]}
        pill>
        {row.status === 1
          ? 'Pending'
          : row.status === 2
          ? 'liquidated'
          : row.status === 3
          ? 'error'
          : 'cancelled'}
      </Badge>
    ),
  },
  {
    sortable: true,
    minWidth: '140px',
    name: 'Fecha',
    sortField: 'date',
    selector: row => row.created_at,
    cell: row => dayjs(row.created_at).format('DD/MM/YYYY hh:mm'),
  },
  {
    name: 'Monto',
    sortable: true,
    minWidth: '100px',
    sortField: 'amount',
    selector: row => row.amount,
    cell: row => <span>${row.amount || 0}°°</span>,
  },
  {
    name: 'Acciones',
    minWidth: '110px',
    cell: row => (
      <div className='column-action d-flex align-items-center'>
        <UncontrolledDropdown>
          <DropdownToggle tag='span'>
            <MoreVertical size={17} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem
              className='w-100'
              href='/'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setPayment(row))
                toggle()
              }}>
              <Edit size={14} className='me-50' />
              <span className='align-middle'>Edit</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
]
