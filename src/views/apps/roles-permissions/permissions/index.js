// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card } from 'reactstrap'

// ** Table Import
import Table from './Table'

const Permissions = () => {
  return (
    <Fragment>
      <h3>Lista de permisos</h3>
      <p>
        Cada categoría incluye los cuatro funciones predefinidas que se muestran
        a continuación.
      </p>
      <Card>
        <div className='card-datatable app-user-list table-responsive'>
          <Table />
        </div>
      </Card>
    </Fragment>
  )
}

export default Permissions
