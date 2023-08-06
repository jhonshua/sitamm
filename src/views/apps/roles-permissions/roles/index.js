// ** React Imports
import { Fragment } from 'react'

// ** Roles Components
import Table from './Table'
import RoleCards from './RoleCards'

const Roles = () => {
  return (
    <Fragment>
      <h3>Lista de roles</h3>
      <p className='mb-2'>
        Listado de roles disponibles en el sistema. Cada rol provee acceso a
        menus y permisos.
      </p>
      <RoleCards />

      <div className='app-user-list'>
        <Table />
      </div>
    </Fragment>
  )
}

export default Roles
