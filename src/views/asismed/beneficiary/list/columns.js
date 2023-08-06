/*eslint semi: ["error", "always"]*/

//date dayjs
import dayjs from 'dayjs'

// ** Table columns
export const columns = () => [
  {
    name: 'Nombre',
    sortable: true,
    minWidth: '200px',
    sortField: 'nombre',
    selector: row => row.nombre,
    cell: row => <span className='text-capitalize'>{row.nombre}</span>,
  },
  {
    name: 'Apellido',
    sortable: true,
    minWidth: '200px',
    sortField: 'apellido_paterno',
    cell: row => (
      <span className='text-capitalize'>{row.apellido_paterno}</span>
    ),
  },
  {
    name: 'Nro membresia',
    sortable: true,
    minWidth: '185px',
    sortField: 'num_membresia',
    selector: row => row.num_membresia,
    cell: row => <span className='text-capitalize'>{row.num_membresia}</span>,
  },
  {
    name: 'inicio servicio',
    sortable: true,
    minWidth: '180px',
    sortField: 'fecha_inicio_servicio',
    selector: row => row.fecha_inicio_servicio,
    cell: row => (
      <span className='text-capitalize'>
        {dayjs(row.fecha_inicio_servicio).format('DD/MM/YYYY hh:mm:ss')}
      </span>
    ),
  },
  {
    name: 'fin servicio',
    sortable: true,
    minWidth: '168px',
    sortField: 'fecha_fin_servicio',
    selector: row => row.fecha_fin_servicio,
    cell: row => (
      <span className='text-capitalize'>
        {dayjs(row.fecha_fin_servicio).format('DD/MM/YYYY hh:mm:ss')}
      </span>
    ),
  },
]
