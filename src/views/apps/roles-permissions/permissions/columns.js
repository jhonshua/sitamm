// ** Reactstrap Imports
import { Badge } from 'reactstrap'

const statusObj = {
  1: 'light-success',
  2: 'light-warning',
}

export const columns = [
  {
    name: 'Nombre',
    sortable: false,
    minWidth: '350px',
    cell: ({ name }) => name,
    selector: row => row.name,
  },
  {
    name: 'grupo',
    sortable: false,
    minWidth: '350px',
    cell: ({ group }) => group,
    selector: row => row.group,
  },
  {
    name: 'estatus',
    sortable: false,
    minWidth: '180px',
    selector: row => row.status,
    cell: ({ status }) => (
      <Badge className='text-capitalize' color={statusObj[status]} pill>
        {status === 2 ? 'Inactivo' : status === 1 ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
]
