// ** Table columns
import { store } from '@store/store'
import { useState } from 'react'
import { setbenefitCategory, activeCategory, desactiveCategory } from './store'
import { MoreVertical, Trash2, Archive, PlusSquare } from 'react-feather'
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

export const columns = (toggle, companies) => [
  {
    name: 'Nombre',
    sortable: true,
    minWidth: '200px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => <span className='text-capitalize'>{row.name}</span>,
  },
  {
    name: 'descripción',
    sortable: true,
    minWidth: '200px',
    sortField: 'description',
    cell: row => <span className='text-capitalize'>{row.description}</span>,
  },
  {
    name: 'compañia',
    sortable: true,
    minWidth: '185px',
    sortField: 'company_id',
    selector: row => row.company_id,
    cell: row => {
      let companyIds = row.company_id

      if (!Array.isArray(companyIds)) {
        companyIds = [companyIds]
      }

      const companyNames = companyIds.map(companyId => {
        const company = companies.data.find(
          company => company._id === companyId
        )
        return company ? company.name : ''
      })

      return (
        <UncontrolledDropdown>
          <DropdownToggle caret className='text-capitalize btn-danger border-0'>
            Mostrar
          </DropdownToggle>
          <DropdownMenu>
            {companyNames.map((companyName, index) => (
              <DropdownItem key={index}>{companyName}</DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    },
  },
  // {
  //   name: 'compañia',
  //   sortable: true,
  //   minWidth: '185px',
  //   sortField: 'company_id',
  //   selector: row => row.company_id,
  //   cell: row => (
  //     <span className='text-capitalize'>
  //       {companies.data
  //         ? companies.data.find(company => company._id == row.company_id)?.name
  //         : 'Loading'}
  //     </span>
  //   ),
  // },
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
                store.dispatch(setbenefitCategory(row))
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
                  store.dispatch(desactiveCategory(row._id))
                }}>
                <Trash2 size={17} className='me-50' />
                <span className='align-middle'>Desactivar</span>
              </DropdownItem>
            ) : row.status === 0 && getRolUser() === 'admin' ? (
              <DropdownItem
                tag='a'
                href='/'
                className='w-100'
                onClick={e => {
                  e.preventDefault()
                  store.dispatch(activeCategory(row._id))
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
