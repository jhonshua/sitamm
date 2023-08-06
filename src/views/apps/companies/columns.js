import { store } from '@store/store'

import {
  MoreVertical,
  Trash2,
  Archive,
  PlusSquare,
  MinusSquare,
} from 'react-feather'

import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

import {
  deleteCompany,
  setCompany,
  activeCompany,
  desactiveCompany,
} from './store'

const statusObj = {
  1: 'light-success',
  2: 'light-warning',
}

export const columns = toggle => [
  {
    name: 'Empresa',
    sortable: false,
    minWidth: '300px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => <span className='text-capitalze'>{row.name}</span>,
  },
  {
    name: 'RFC',
    sortable: false,
    minWidth: '300px',
    sortField: 'rfc',
    selector: row => row.rfc,
    cell: row => <span className='text-capitalize'>{row.rfc}</span>,
  },
  {
    name: 'Estatus',
    minWidth: '138px',
    sortable: false,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status === 2
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
                store.dispatch(setCompany(row))
                toggle()
              }}>
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Editar Empresa</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                store.dispatch(deleteCompany(row._id))
              }}>
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>Eliminar Empresa</span>
            </DropdownItem>

            {row.status === 1 ? (
              <DropdownItem
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(desactiveCompany(row._id))
                }}>
                <MinusSquare size={17} className='me-50' />
                <span className='align-middle'>Desactivar</span>
              </DropdownItem>
            ) : row.status === 2 ? (
              <DropdownItem
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(activeCompany(row._id))
                }}>
                <PlusSquare size={20} className='me-50' />
                <span className='align-middle'>Activar</span>
              </DropdownItem>
            ) : (
              <></>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
]
