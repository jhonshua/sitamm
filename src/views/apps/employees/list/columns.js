// ** Store & Actions
import { store } from '@store/store'
import { setEmployee, setPrintCredential } from '../store'

// ** Icons Imports
import {
  MoreVertical,
  Printer,
  Archive,
  CreditCard,
  Clipboard,
} from 'react-feather'

// ** Reactstrap Imports
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

const statusObj = {
  0: 'light-warning',
  1: 'light-success',
  2: 'light-secondary',
}

export const columns = (modal, toggle, vcard) => [
  {
    name: 'Nombre',
    minWidth: '138px',
    sortable: true,
    sortField: 'name',
    selector: row => row.name,
    cell: row => <span className='text'>{row.name}</span>,
  },
  {
    name: 'Apellidos',
    minWidth: '138px',
    sortable: true,
    sortField: 'mothers_name',
    selector: row => row.full_name,
    cell: row => (
      <span className='text'>
        {row.last_name} {row.mothers_name}
      </span>
    ),
  },
  {
    name: 'Empresa',
    minWidth: '138px',
    sortable: false,
    sortField: 'currentPlan',
    selector: row => row.full_name,
    cell: row => <span className='text-capitalize'>{row.company.name}</span>,
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
          ? 'Pendiente'
          : row.status === 1
          ? 'Activo'
          : 'Inactivo'}
      </Badge>
    ),
  },
  {
    name: 'prestamo',
    minWidth: '150px',
    sortable: true,
    sortField: 'currentPlan',
    cell: row =>
      row.debt ? (
        <span className='text-capitalize'>${row.debt.toLocaleString()}</span>
      ) : (
        <span className='text-capitalize'>$0.00</span>
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
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setEmployee(row))
                modal()
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
                console.log(row)
                store.dispatch(setPrintCredential(row))
              }}>
              <Printer size={14} className='me-50' />
              <span className='align-middle'>Imprimir Credencial</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setEmployee(row))
                toggle()
              }}>
              <Clipboard size={14} className='me-50' />
              <span className='align-middle'>Expediente</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                vcard(row)
              }}>
              <CreditCard size={14} className='me-50' />
              <span className='align-middle'>Vcard</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
]
