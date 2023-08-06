// ** React Imports
import { Fragment, useState } from 'react'
//impartacion de react-redux
import { useDispatch, useSelector } from 'react-redux'
//importacion de las actions
import {
  setModal,
  setSidebar,
  getData,
  setEmployee,
  resetStateFiles,
  deleteFile
} from '../store/index'
//componente fileUpload
import FileUploaderRestrictions from './FileUploaderRestrictions'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  Button,
  CardTitle,
  CardHeader,
  ModalBody,
  ModalHeader
} from 'reactstrap'
import logo from '../../../../assets/images/logo/logo.png'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const EmployeeFile = () => {
  // ** States
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.employees)
  const selectedEmployee = useSelector(
    state => state.employees.selectedUser
  )

  //resetear stores files y cierre del modal
  const toggleModal = () => {
    dispatch(setModal(!store.modal))
    dispatch(setSidebar(false))
    dispatch(setEmployee(false))
    dispatch(resetStateFiles())
    dispatch(
      getData({
        sort: store.params.sort,
        sortColumn: store.params.sortColumn,
        q: store.params.q,
        page: store.params.page,
        perPage: store.params.perPage,
        status: store.params.status
      })

    )
  }

  //elimina el archivo en el backend y actualiza el estado file
  const handlerDelete = (id, name, multimedia) => {
    if (id && name && multimedia) {
      const data = {
        id,
        name,
        multimedia
      }
      dispatch(deleteFile(data))
    }
  }

  return (
    <Fragment>
      <Modal
        isOpen={store.modal || false}
        toggle={() => toggleModal()}
        className='modal-dialog-centered modal-lg'>
        <ModalHeader
          className='bg-transparent'
          toggle={() => toggleModal()}>

        </ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Adjuntar Archivos de Afiliado  <img
              src={logo}
              height='50'
              width='50'
            /></h1>
            {selectedEmployee && (
              <p className='fs-4'>
                Nombre de empleado:{' '}
                <span>
                  {selectedEmployee.name} {selectedEmployee.last_name}
                </span>
              </p>
            )}
          </div>
          <Row className='gy-1 pt-75'>
            <Col md={6} xs={12}>
              <CardHeader>
                <CardTitle tag='h4' className='text-center'>
                  Fotografia.
                </CardTitle>
              </CardHeader>

              {selectedEmployee?.selfie_id ? (
                <Col className=' d-flex flex-column w-75 mx-auto'>
                  <img
                    className='rounded mx-auto d-block my-5'
                    src={selectedEmployee.selfie_url.url}
                    height='100'
                    width='100'
                  />

                  <Button
                    className='me-1 sm'
                    color='danger'
                    outline
                    onClick={() => handlerDelete(
                      selectedEmployee._id,
                      'selfie_id',
                      selectedEmployee.selfie_id

                    )
                    }>
                    {' '}
                    Eliminar archivo{' '}
                  </Button>
                </Col>
              ) : (
                <FileUploaderRestrictions
                  id={selectedEmployee?._id}
                  name={'selfie_id'}
                  typeFile={'selfie'}
                  nameFile={'file'}
                  setLoading={setLoading}
                />

              )}
            </Col>
            <Col md={6} xs={12}>
              <CardHeader>
                <CardTitle tag='h4' className='text-center'>
                  Ine Frontal.
                </CardTitle>
              </CardHeader>

              {selectedEmployee?.ine_front_id ? (
                <Col className=' d-flex flex-column w-75 mx-auto'>
                  <img
                    className='rounded mx-auto d-block my-5'
                    src={selectedEmployee.ine_front_url.url}
                    height='100'
                    width='100'
                  />

                  <Button
                    className='me-1 sm'
                    color='danger'
                    outline
                    onClick={() => handlerDelete(
                      selectedEmployee._id,
                      'ine_front_id',
                      selectedEmployee.ine_front_id
                    )
                    }>
                    {' '}
                    Eliminar archivo{' '}
                  </Button>
                </Col>
              ) : (
                <FileUploaderRestrictions
                  id={selectedEmployee?._id}
                  name={'ine_front_id'}
                  typeFile={'ine_f'}
                  nameFile={'ine front'}
                  setLoading={setLoading}
                />
              )}
            </Col>
            <hr />
            <Col md={6} xs={12}>
              <CardHeader>
                <CardTitle tag='h4' className='text-center'>
                  Ine Trasera.
                </CardTitle>
              </CardHeader>

              {selectedEmployee?.ine_back_id ? (
                <Col className=' d-flex flex-column mt-sm-2 mt-md-2 mt-lg-0 w-75 mx-auto'>
                  <img
                    className='rounded mx-auto d-block my-5'
                    src={selectedEmployee.ine_back_url.url}
                    height='100'
                    width='100'
                  />

                  <Button
                    className='me-1 sm'
                    color='danger'
                    outline
                    onClick={() => handlerDelete(
                      selectedEmployee._id,
                      'ine_back_id',
                      selectedEmployee.ine_back_id
                    )
                    }>
                    {' '}
                    Eliminar archivo{' '}
                  </Button>
                </Col>
              ) : (
                <FileUploaderRestrictions
                  id={selectedEmployee?._id}
                  name={' ine_back_id'}
                  typeFile={'ine_b'}
                  nameFile={'ine back'}
                  setLoading={setLoading}
                />
              )}
            </Col>
            <Col md={6} xs={12}>
              <CardHeader>
                <CardTitle tag='h4' className='text-center'>
                  Comprobante de domicilio.
                </CardTitle>
              </CardHeader>
              {selectedEmployee?.proof_of_address_id ? (
                <Col className=' d-flex flex-column w-75 mx-auto'>
                  <img
                    className='rounded mx-auto d-block my-5'
                    src={selectedEmployee.proof_of_address_url.url}
                    height='100'
                    width='100'
                  />

                  <Button
                    className='me-1 '
                    color='danger'
                    outline
                    onClick={() => handlerDelete(
                      selectedEmployee._id,
                      'proof_of_address_id',
                      selectedEmployee.proof_of_address_id
                    )
                    }>
                    {' '}
                    Eliminar archivo{' '}
                  </Button>
                </Col>
              ) : (
                <FileUploaderRestrictions
                  id={selectedEmployee?._id}
                  name={' proof_of_address_id'}
                  pdf={true}
                  typeFile={'address'}
                  nameFile={'address'}
                  setLoading={setLoading}
                />
              )}
            </Col>
            <Col xs={12} className='text-center pt-5 '>
              <Button
                type='reset'
                className='ms-4'
                color='danger'
                outline
                onClick={() => toggleModal()
                }>
                Cerrar
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment >
  )
}

export default EmployeeFile
