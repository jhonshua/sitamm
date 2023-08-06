// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'
import EmployeeFile from './modalFiles'
// ** Table Columns
import { columns } from './columns'

// ** Modal Component
import { MultipleEmployeeModal } from '../list/Modal'

// ** Store & Actions
import { getData, setSidebar, setModal } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { getData as getCompanies } from '../../companies/store'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { QRCodeSVG } from 'qrcode.react'
import { ChevronDown } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const createVcard = (values, companies) => {
  let company = undefined
  if (companies.data) {
    company = companies.data.filter(e => e._id === values.company_id)[0]?.name
  }
  let str = 'BEGIN:VCARD\n'
  str += 'VERSION:3.0\n'
  str += `N: ${values.last_name} ${values.mothers_name}; ${values.name}\n`
  str += `ORG:${company}\n`
  str += 'URL:\n'
  str += 'END:VCARD'
  return str
}

// ** Table Header
const CustomHeader = ({
  store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(store.data[0])

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
      let ctr = 0
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter

        result += item[key]

        ctr++
      })
      result += lineDelimiter
    })

    return result
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv === null) return
    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Ver:</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}>
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <Label for='sort-select'>por pagina.</Label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end
          justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column
          pe-xl-1 p-0 mt-xl-0 mt-1'>
          <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Buscar:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>

          <div className='d-flex align-items-center table-header-actions'>
            <Button
              className='add-new-user ms-1'
              color='primary'
              onClick={toggleSidebar}>
              Agregar Afiliado
            </Button>
            <MultipleEmployeeModal visible={true} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const EmployeesList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.employees)
  const companiesStore = useSelector(state => state.companies)

  // ** States
  const [sort, setSort] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentRole, setCurrentRole] = useState({
    value: '',
    label: 'Seleccione Rol',
  })
  const [currentStatus, setCurrentStatus] = useState({
    value: '',
    label: 'Seleccione Estatus',
    number: 0,
  })
  const [vcard, setVcard] = useState({})

  // ** Function to toggle sidebar
  const toggleSidebar = () => {
    dispatch(setSidebar(!store.sidebar))
  }

  const toggleModal = () => {
    dispatch(setModal(!store.modal))
  }

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        status: currentStatus.value,
      })
    )
  }, [dispatch, store?.length, sort, sortColumn, currentPage])

  // ** Get companies for vcard
  useEffect(() => {
    dispatch(
      getCompanies({
        sort: 'asc',
        sortColumn: 'asc',
        q: '',
        page: 1,
        perPage: 10,
      })
    )
  }, [dispatch])

  const statusOptions = [
    { value: '', label: 'Seleccione Estatus', number: -2 },
    { value: 'active', label: 'Activo', number: 1 },
    { value: 'pending', label: 'Pendiente', number: 0 },
    { value: 'inactive', label: 'Inactivo', number: -1 },
  ]

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: page.selected + 1,
        role: currentRole.value,
        status: currentStatus.value,
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: value,
        page: currentPage,
        role: currentRole.value,
        status: currentStatus.value,
      })
    )
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm(val)
    dispatch(
      getData({
        sort,
        q: val ? `$text[$search]=${val}` : val,
        sortColumn,
        page: currentPage,
        perPage: rowsPerPage,
        status: currentStatus.value,
      })
    )
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store?.total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={
          'pagination react-paginate justify-content-end my-2 pe-1'
        }
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      role: currentRole.value,
      status: currentStatus.value,
      q: searchTerm,
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data?.length > 0) {
      return store.data
    } else if (store.data?.length === 0 && isFiltered) {
      return []
    }
  }

  const handleSort = (column, sortDirection) => {
    setSortColumn(column.sortField)
    if (sortDirection === 'asc') {
      setSort(`&$sort[${column.sortField}]=1`)
      console.log(1)
    } else if (sortDirection === 'desc') {
      setSort(`&$sort[${column.sortField}]=-1`)
      console.log(-1)
    }
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        perPage: rowsPerPage,
        status: currentStatus.value,
      })
    )
  }

  return (
    <Fragment>
      <div className='vertically-centered-modal'>
        <Modal
          isOpen={Object.keys(vcard).length > 0}
          className='modal-dialog-centered'>
          <ModalHeader>Vcard</ModalHeader>
          <ModalBody
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <QRCodeSVG
              value={createVcard(vcard, companiesStore)}
              size={290}
              level={'H'}
              includeMargin={true}></QRCodeSVG>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setVcard({})}>
              Cerrar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filtros de búsqueda afiliados</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={statusOptions}
                value={currentStatus}
                onChange={data => {
                  setCurrentStatus(data)
                  console.log(data)
                  dispatch(
                    getData({
                      sort,
                      q: `status=${data.number}`,
                      page: currentPage,
                      perPage: rowsPerPage,
                    })
                  )
                }}
              />
            </Col>
            <Col md='2'>
              <Button
                outline
                color='primary'
                onClick={() => {
                  setRowsPerPage(10)
                  setCurrentPage(1)
                  setSearchTerm('')
                  setCurrentStatus({
                    value: '',
                    label: 'Seleccione Estatus',
                    number: 0,
                  })
                  setSort('desc')
                  dispatch(
                    getData({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      page: currentPage,
                      perPage: rowsPerPage,
                      status: currentStatus.value,
                    })
                  )
                }}>
                <span className='align-middle ms-25'>Actualizar</span>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <CardHeader>
            <CardTitle tag='h4'> Lista de afiliados</CardTitle>
          </CardHeader>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            noDataComponent={<p>No se encontraron registros</p>}
            columns={columns(toggleSidebar, toggleModal, setVcard)}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>
      <Sidebar />
      <EmployeeFile />
    </Fragment>
  )
}

export default EmployeesList
