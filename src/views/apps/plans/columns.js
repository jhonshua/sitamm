/*eslint semi: ["error", "always"]*/
//  import store and dispatch
import { store } from '@store/store';
import { setPlans, deletePlans, getData } from './store';


// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Badge
} from 'reactstrap';

//father icon
import {
   Edit,
   Trash2,
  MoreVertical
} from 'react-feather';

//style status
const statusObj = {
  0: 'light-warning',
  1: 'light-success',
  2: 'light-secondary'
};

// ** Table columns
export const columns = toggle => [
  {
    name: 'Nombre',
    sortable: true,
    minWidth: '250px',
    sortField: 'name',
    selector: row => row.name,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{row.name}</h6>
          </div>
        </div>
      );
    }
  },
  {
    name: 'Descripción',
    sortable: true,
    minWidth: '250px',
    sortField: 'description',
    selector: row => row.description,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column'>
            <h6 className='user-name text-truncate mb-0'>{row.description}</h6>
          </div>
        </div>
      );
    }
  },
  {
    name: 'Estado',
    minWidth: '140px',
    sortable: true,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status ? row.status : 0]} pill>
        { row.status === 0 ? 'inactivo' : 'activo'}
      </Badge>
    )
  },
 {
    name: 'Acción',
    minWidth: '110px',
    cell: row  => (
      <div className='column-action d-flex align-items-center'>
     <UncontrolledDropdown>
          <DropdownToggle tag='span'>
            <MoreVertical size={17} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem className='w-100'
              href='/'
              onClick={ e => {
                e.preventDefault();
                store.dispatch(setPlans(row));
                  toggle();
              }}
            >
              <Edit size={14} className='me-50' />
              <span className='align-middle'>Edit</span>
            </DropdownItem>
            <DropdownItem className='w-100'
              href='/'
              onClick={ e => {
                e.preventDefault();
                store.dispatch(deletePlans(row._id));
                store.dispatch(getData({
                  sort:"desc",
                  perPage:10,
                  page:1,
                  q:""
                }));
              }}
            >
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>Eliminar</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }
];
