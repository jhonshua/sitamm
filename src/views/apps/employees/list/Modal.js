// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'
import * as ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import { toast } from 'react-hot-toast'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getData as getCompanies } from '../../companies/store'
import { addEmployee } from '../store'

const columns = [
  'nombre',
  'apellido paterno',
  'apellido materno',
  'numero telefonico',
  'email',
  'curp',
  'rfc',
  'banco',
  'numero de cuenta',
  'clabe',
  'percepcion total',
  'deduccion total',
  'liquido',
  'minimo de prestamo',
  'maximo de prestamo',
]

export const MultipleEmployeeModal = ({ visible }) => {
  const [modal, setModal] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(false)
  const [company, setCompany] = useState(undefined)
  const [employeeCount, setEmployeeCount] = useState(0)
  const [newEmployees, setNewEmployees] = useState([])
  const [files, setFiles] = useState([])
  const companiesStore = useSelector(state => state.companies)

  const dispatch = useDispatch()

  // ** Get companies on mount
  useEffect(() => {
    dispatch(
      getCompanies({
        sort: 'desc',
        sortColumn: 'desc',
        q: '',
        page: 1,
        perPage: 50,
      })
    )
  }, [dispatch])

  const handleOk = async () => {
    if (files.length === 0) {
      toast.error('Por favor seleccione un archivo')
      return
    }
    if (!company) {
      toast.error('Por favor seleccione una empresa')
      return
    }

    const workbook = new ExcelJS.Workbook()

    await workbook.xlsx.load(files[0])
    const worksheet = workbook.getWorksheet(1)
    const row1 = worksheet.getRow(1)

    // Column validation

    const columns2 = [
      'name',
      'last_name',
      'mothers_name',
      'phone_number',
      'email',
      'curp',
      'rfc',
      'bank',
      'account_name',
      'clabe',
      'total_perception',
      'total_deduction',
      'liquidity',
      'max_amount',
      'min_amount',
    ]

    for (let i = 0; i < columns.length; i++) {
      if (row1.getCell(i + 1).value.toLowerCase() !== columns[i]) {
        toast.error('El archivo no tiene las columnas correctas')
        return
      }
    }

    const new_employees = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      const employee = {}
      row.eachCell((cell, colNumber) => {
        employee[columns2[colNumber - 1]] = '' + cell.value
      })
      employee.company_id = company
      console.log(employee)
      new_employees.push(employee)
    })
    setNewEmployees(new_employees)
    setEmployeeCount(new_employees.length)
    setModalConfirm(true)
    setCompany(undefined)
    setFiles([])
    setModal(false)
  }

  const downloadLayout = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Empleados')
    worksheet.addRow(columns)
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })
      FileSaver(blob, 'Plantilla.xlsx')
    })
  }

  const handleCancel = () => {
    setCompany(undefined)
    setFiles([])
    setModal(false)
  }

  const addEmployees = () => {
    for (let i = 0; i < newEmployees.length; i++) {
      dispatch(addEmployee(newEmployees[i]))
    }
  }

  // Functions for file upload

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { '/*': ['.xlsx'] },
    onDrop: acceptedFiles => {
      setFiles([...acceptedFiles.map(file => Object.assign(file))])
    },
  })

  const renderFilePreview = file => {
    return <FileText size='28' />
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color='danger'
        outline
        size='sm'
        className='btn-icon'
        onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <>
      <Button
        className='add-new-user ms-1'
        color='primary'
        onClick={() => {
          setModal(!modal)
        }}>
        Cargar Layout
      </Button>
      <Modal isOpen={modalConfirm} toggle={handleCancel}>
        <ModalHeader>
          <h4 className='modal-title'>Agregar Afiliados</h4>
        </ModalHeader>
        <ModalBody>
          <p>
            Estas seguro de agregar {employeeCount} empleados a la empresa{' '}
            {companiesStore?.data
              ? companiesStore.data.find(c => c._id === company)?.name
              : 'Cargando...'}
            ?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={() => {
              addEmployees()
              setModalConfirm(false)
            }}>
            Agregar
          </Button>
          <Button
            color='secondary'
            onClick={() => {
              setModalConfirm(false)
            }}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal} toggle={handleCancel}>
        <ModalHeader>
          <h4 className='modal-title'>Agregar Afiliados</h4>
        </ModalHeader>
        <ModalBody>
          <Card>
            <Label>Seleccione empresa</Label>
            <div
              className='mb-1'
              value={company}
              onChange={e => setCompany(e.target.value)}>
              <Input type='select' id='company_id' name='company_id'>
                <option key={''} value={''}>
                  Seleccione una empresa
                </option>
                {companiesStore.data.map(company => {
                  return (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  )
                })}
              </Input>
            </div>
            <CardBody>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div
                  className='d-flex align-items-center justify-content-center
                flex-column'>
                  <DownloadCloud size={64} />
                  <h5>
                    Arrastra un archivo de excel o haz click aqui para subirlo
                  </h5>
                </div>
              </div>
              {files.length ? (
                <Fragment>
                  <ListGroup className='my-2'>{fileList}</ListGroup>
                  <div className='d-flex justify-content-end'>
                    <Button
                      className='me-1'
                      color='danger'
                      outline
                      onClick={handleRemoveAllFiles}>
                      Eliminar archivo
                    </Button>
                  </div>
                </Fragment>
              ) : null}
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={handleOk}>
            Guardar
          </Button>
          <Button color='secondary' onClick={downloadLayout}>
            Descargar Plantilla
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
