import { store } from '@store/store'

import { MoreVertical, Trash2, Book, Info, FileText } from 'react-feather'

//date dayjs
import dayjs from 'dayjs'

import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

import { deleteLoan, setLoan } from './store'

const statusObj = {
  0: 'light-warning',
  1: 'light-success',
  2: 'light-secondary',
}

export const columns = (toggle, modal, modalContratos, modalNom) => [
  {
    name: 'Afiliado',
    sortable: true,
    minWidth: '100px',
    sortField: 'name',
    selector: row => row.employee_id,
    cell: row => <span className='text-capitalze'>{row.employee?.name}</span>,
  },
  {
    name: 'Fecha',
    sortable: true,
    minWidth: '200px',
    sortField: 'start_date',
    selector: row => row.start_date,
    cell: row => (
      <span className='text-capitalize'>
        {dayjs(row.created_at).format('DD/MM/YYYY hh:mm:ss')}
      </span>
    ),
  },
  {
    name: 'Tasa',
    sortable: true,
    minWidth: '100px',
    sortField: 'rates',
    selector: row => row.rates,
    cell: row => <span className='text-capitalize'>{row.rates}%</span>,
  },
  {
    name: 'Monto',
    sortable: true,
    minWidth: '150px',
    sortField: 'amount',
    selector: row => row.amount,
    cell: row => <span className='text-capitalize'>${row.amount}</span>,
  },
  {
    name: 'Estatus',
    minWidth: '138px',
    sortable: true,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status === 0
          ? 'Inactivo'
          : row.status === 1
          ? 'Activo'
          : 'Inactivo'}
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
                store.dispatch(setLoan(row))
                modal()
              }}>
              <Info size={14} className='me-50' />
              <span className='align-middle'>Detalles</span>
            </DropdownItem>
            {/* <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setLoan(row))
                toggle()
              }}
            >
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Editar</span>
            </DropdownItem> */}
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setLoan(row))
                modalNom()
              }}>
              <Book size={14} className='me-50' />
              <span className='align-middle'>Nom</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(setLoan(row))
                modalContratos()
              }}>
              <FileText size={14} className='me-50' />
              <span className='align-middle'>Contrato</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(deleteLoan(row._id))
              }}>
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>
                {row.status == 1 ? 'Desactivar' : 'Activar'}
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
]
