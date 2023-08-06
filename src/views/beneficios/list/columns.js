// ** Table columns
import { store } from '@store/store'
import { setbenefit, activeBenefit, desactiveBenefit } from './store'
import { MoreVertical, MinusSquare, Archive, PlusSquare } from 'react-feather'
import { getUserData } from '../../../utility/Utils'
import {
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

export const getRolUser = () => {
  return getUserData().rol
}
const statusObj = {
  0: 'light-danger',
  1: 'light-success',
  2: 'light-warning',
}

export const columns = (toggle, categories) => [
  {
    name: 'titulo',
    sortable: true,
    minWidth: '180px',
    sortField: 'title',
    selector: row => row.title,
    cell: row => <span className='text-capitalize'>{row.title}</span>,
  },
  {
    name: 'descripción',
    sortable: true,
    minWidth: '650px',
    sortField: 'description',
    selector: row => row.description,
    cell: row => <span className='text-capitalize'>{row.description}</span>,
  },
  {
    name: 'Categoria',
    sortable: true,
    minWidth: '185px',
    sortField: 'category_id',
    selector: row => row.category_id,
    cell: row => (
      <span className='text-capitalize'>
        {categories.data
          ? categories.data.find(category => category._id == row.category_id)
              ?.name
          : 'Loading'}
      </span>
    ),
  },
  {
    name: 'Estado',
    minWidth: '138px',
    sortable: true,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status === 0 ? 'Inactivo' : row.status === 1 ? 'Activo' : 'Error'}
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
                store.dispatch(setbenefit(row))
                toggle()
              }}>
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Editar</span>
            </DropdownItem>
            {row.status === 1 && getRolUser() === 'admin' ? (
              <DropdownItem
                tag='a'
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(desactiveBenefit(row._id))
                }}>
                <MinusSquare size={17} className='me-50' />
                <span className='align-middle'>Desactivar</span>
              </DropdownItem>
            ) : row.status === 0 && getRolUser() === 'admin' ? (
              <DropdownItem
                tag='a'
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(activeBenefit(row._id))
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
