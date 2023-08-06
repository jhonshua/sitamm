// ** React Imports
/*eslint semi: ["error", "always"]*/
import { useEffect, useState } from 'react'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Columns
import { columns } from './columns'

// ** Third Party Components
import SidebarPayments from './Sidebar'
import Select from 'react-select'
import { ChevronDown } from 'react-feather'
import Flatpickr from 'react-flatpickr'

// import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Label,
  Row,
  Input,
  Button,
} from 'reactstrap'

// ** Store & Actions
import { getPayment, setSidebar } from './store'
import { useDispatch, useSelector } from 'react-redux'

// ** Utils
import { selectThemeColors } from '@utils'

const statusOptions = [
  { label: 'Cancelado', number: 0, value: 0 },
  { label: 'Pendiente', number: 1, value: 1 },
  { label: 'Liquidado', number: 2, value: 2 },
  { label: 'Error', number: 3, value: 3 },
]

const customStyles = {
  table: {
    style: {
      minHeight: '200px',
    },
  },
}

const PaymentList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.payments)
  const total = useSelector(state => state.payments.total)

  // ** States
  const [sort, setSort] = useState('desc')
  const [sortColumn, setSortColumn] = useState('name')
  const [searchValue, setSearchValue] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentRole, setCurrentRole] = useState({
    value: 0,
    label: 'Seleccione Estatus',
    status: false,
  })

  const [picker, setPicker] = useState(new Date())
  const [usedPicker, setUsedPicker] = useState(false)

  // ** Get data
  useEffect(() => {
    dispatch(
      getPayment({
        sort,
        sortColumn,
        perPage: rowsPerPage,
        page: currentPage,
      })
    )
  }, [dispatch, store?.length, sort, sortColumn, currentPage])

  //** Function in get data on page change
  const handlePagination = page => {
    if (currentRole.status === true) {
      dispatch(
        getPayment({
          sort,
          sortColumn,
          q: `employee_id=${value}`,
          status: currentRole.value,
          perPage: rowsPerPage,
          page: page.selected + 1,
        })
      )
      setCurrentPage(page.selected + 1)
    } else {
      dispatch(
        getPayment({
          sort,
          sortColumn,
          perPage: rowsPerPage,
          page: page.selected + 1,
        })
      )
      setCurrentPage(page.selected + 1)
    }
  }

  // ** Function to handle Search bar
  const handleSearchBar = e => {
    const value = e.target.value
    setSearchValue(value)

    if (value.length) {
      dispatch(
        getPayment({
          q: `employee_id=${value}`,
          perPage: rowsPerPage,
          page: currentPage,
        })
      )
    } else {
      dispatch(
        getPayment({
          perPage: rowsPerPage,
          page: currentPage,
        })
      )
    }
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getPayment({
        sort,
        sortColumn,
        perPage: value,
        page: currentPage,
      })
    )
    setRowsPerPage(value)
  }

  // function sort on store
  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getPayment({
        sort,
        sortColumn,
        perPage: rowsPerPage,
        page: currentPage,
      })
    )
  }

  // ** Function to toggle sidebar
  const toggleSidebar = () => {
    dispatch(setSidebar(!store.data.sidebar))
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total && total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={usedPicker ? 1 : count || 1}
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

  const selectDate = date => {
    setPicker(date)
    setUsedPicker(true)

    dispatch(
      getPayment({
        sort,
        perPage: 100,
      })
    )
  }

  const dataToRender = data => {
    if (!usedPicker) {
      return data
    }

    const filteredData = []
    for (let i = 0; i < data.length; i++) {
      const date = new Date(data[i].date)
      if (date >= picker[0] && date <= picker[1]) {
        filteredData.push(data[i])
      }
    }
    return filteredData
  }

  return (
    <div className='invoice-list-wrapper'>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filtro pagos realizados</CardTitle>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md='3' className='d-flex flex-column align-items-start'>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                placeholder={currentRole.label}
                options={statusOptions}
                value={currentRole.value}
                onChange={value => {
                  setCurrentRole({
                    value: value.number,
                    label: value.label,
                    status: true,
                  })
                  dispatch(
                    getPayment({
                      sort,
                      sortColumn,
                      q: `status=${value.number}`,
                      status: value.number,
                      perPage: rowsPerPage,
                      page: 1,
                    })
                  )
                }}
              />
            </Col>
            <Col md='2' className='d-flex flex-column align-items-start'>
              <Label for='status-select'>Fecha</Label>
              <Flatpickr
                value={picker}
                id='range-picker'
                className='form-control'
                onChange={selectDate}
                options={{
                  dateFormat: 'd-m-Y',
                  mode: 'range',
                }}
              />
            </Col>
            <Col md='2' className='mt-2'>
              <Button
                outline
                color='primary'
                onClick={() => {
                  setSearchValue('')
                  setCurrentRole({
                    value: '',
                    label: 'Seleccione Estatus',
                    status: false,
                  })
                  dispatch(
                    getPayment({
                      perPage: rowsPerPage,
                      page: currentPage,
                    })
                  )
                  setUsedPicker(false)
                  setPicker(new Date())
                }}>
                <span className='align-middle ms-25'>Actualizar</span>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Lista pagos realizados</CardTitle>
        </CardHeader>
        <div className='invoice-list-dataTable react-dataTable'>
          <Row>
            <Col md='6'>
              <div className='d-flex align-items-center'>
                <Label for='sort-select' className='fs-5 m-1'>
                  Ver:
                </Label>
                <Input
                  className='dataTable-select'
                  type='select'
                  id='sort-select'
                  value={rowsPerPage}
                  onChange={handlePerPage}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </Input>
                <Label for='sort-select' className='fs-5 m-1'>
                  {' '}
                  por pagina
                </Label>
              </div>
            </Col>

            {/* <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
              <Label className='me-1 fs-5 ' for='search-input'>
                Search
              </Label>
              <Input
                className='dataTable-filter'
                type='text'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={handleSearchBar}
              />
            </Col> */}
          </Row>

          <DataTable
            customStyles={customStyles}
            noHeader
            pagination
            sortServer
            paginationServer
            responsive
            noDataComponent={<p>No se encontraron registros</p>}
            onSort={handleSort}
            subHeader={true}
            columns={columns(toggleSidebar)}
            sortIcon={<ChevronDown />}
            data={dataToRender(store.data)}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            //  defaultSortField='employees.name'
          />
        </div>
      </Card>
      <SidebarPayments />
    </div>
  )
}

export default PaymentList
