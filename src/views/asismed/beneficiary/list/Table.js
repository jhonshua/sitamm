// ** React Imports
/*eslint semi: ["error", "always"]*/
import { Fragment, useState, useEffect } from 'react'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { selectThemeColors } from '@utils'

// ** Table Columns
import { columns } from './columns'
import Modal from './modalForm'
// ** Store & Actions
import { setModal, getData, FindBeneficiary } from '../store'
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Button,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
} from 'reactstrap'
import Select from 'react-select'

const BeneficiaryList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.beneficiary)

  //   // ** States
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [currentStatus, setCurrentStatus] = useState({
    label: 'Seleccione Estatus',
    number: 0,
    value: '',
  })

  const toggleModal = () => {
    dispatch(setModal(!store.modal))
  }

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        sort,
        perPage: rowsPerPage,
        page: currentPage,
        q: searchTerm,
      })
    )
  }, [dispatch, sort, currentPage])
  useEffect(() => {
    dispatch(
      getData({
        sort,
        perPage: rowsPerPage,
        page: currentPage,
        q: searchTerm,
      })
    )
  }, [dispatch, sort, currentPage])

  // ** Function to handle filter
  const handleFilter = e => {
    setSearchValue(e.target.value)
    if (searchValue.length <= 2) {
      dispatch(
        getData({
          sort,
          perPage: rowsPerPage,
          page: currentPage,
          q: searchTerm,
        })
      )
    } else {
      dispatch(
        FindBeneficiary({
          sort,
          page: currentPage,
          perPage: rowsPerPage,
          q: e.target.value,
        })
      )
    }
  }

  //**status Options
  const statusOptions = [
    { label: 'Seleccionar Estatus', number: 0, value: '' },
    { label: 'Inactivo', number: 0, value: 0 },
    { label: 'Activo', number: 1, value: 1 },
  ]

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    dispatch(
      getData({
        sort,
        page: page.selected + 1,
        perPage: rowsPerPage,
        q: searchValue,
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = e => {
    dispatch(
      getData({
        sort,
        page: currentPage,
        perPage: parseInt(e.target.value),
        q: searchValue,
      })
    )
    setRowsPerPage(parseInt(e.target.value))
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(store.total / rowsPerPage)

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }

  const customStyles = {
    table: {
      style: {
        minHeight: '350px',
      },
    },
  }

  return (
    <Fragment>
      <Card>
        {/* <CardHeader>
          <CardTitle tag='h4'>Filtros de búsqueda </CardTitle>
        </CardHeader> */}
        <CardBody>
          {/* <Row>
            <Col md='4'>
              <Label for='status-select'>Status</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select' 
                options={statusOptions}
                value={currentStatus} 
                onChange={data => {
                  setCurrentStatus(data);
                  dispatch(
                    getData({
                      sort,
                      q:`status=${data.number}`,
                      page: currentPage,
                      perPage: rowsPerPage
                    })
                  );
                }}        
              />
              
            </Col>
            <Col md='2'>
              <Label for='status-select'>Actualizar</Label>
              <Button
                outline
                color='primary'
                onClick={() => {
                  setRowsPerPage(10)
                  setCurrentPage(1)
                  setSearchValue('')
                  setCurrentStatus({
                    label: 'Seleccione Estatus',
                    number: 0,
                    value: '',
                  })
                  setSort('desc')
                  dispatch(
                    getData({
                      sort,
                      perPage: rowsPerPage,
                      page: currentPage,
                      q: searchTerm,
                    })
                  )
                }}>
                <span className='align-middle ms-25'>Actualizar</span>
              </Button>
            </Col>
          </Row> */}
        </CardBody>
      </Card>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Lista de beneficiario</CardTitle>
          {/* <Button className='add-new-user' color='primary' onClick={toggleModal}>
              Agregar Beneficiario
          </Button> */}
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>Ver:</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </Input>
              <Label for='sort-select'>por pagina.</Label>
            </div>
          </Col>
          <Col
            className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1'
            sm='6'>
            <Label className='me-1' for='search-input'>
              Buscar
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns(toggleModal)}
            customStyles={customStyles}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={store.data}
          />
        </div>
      </Card>
      <Modal />
    </Fragment>
  )
}

export default BeneficiaryList
