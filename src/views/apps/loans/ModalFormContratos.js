// ** React Imports
import { useEffect } from 'react'
import { setModal_contartos, getData_multimedia_contratos } from './store'
import { useDispatch, useSelector } from 'react-redux' // ** React Imports
import logo from '../../../assets/images/logo/logo.png'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const ModalFormContratos = () => {
  // ** States
  const dispatch = useDispatch()
  const store = useSelector(state => state.loans)
  let base64_data =
    store?.selectedLoan?.nom151_response?.response?.data?.archivo_original

  useEffect(() => {
    //dispatch(getData_multimedia_contratos(base64_data
    base64_data =
      store?.selectedLoan?.nom151_response?.response?.data?.archivo_original
    console.log(base64_data)
  }, [store.modal_contratos])
  console.log(base64_data)
  return (
    <div className='demo-inline-spacing'>
      <div>
        <Modal
          isOpen={store.modal_contratos || false}
          toggle={() => dispatch(setModal_contartos(!store.modal_contratos))}>
          <ModalHeader
            toggle={() => dispatch(setModal_contartos(!store.modal_contratos))}>
            <h2>
              <img src={logo} height='40' width='40' />
              Contrato
            </h2>
          </ModalHeader>
          {base64_data ? (
            <ModalBody>
              <object
                data={`data:application/pdf;base64,${base64_data}`}
                type='application/pdf'
                width='100%'
                height='600px'></object>
            </ModalBody>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
              }}>
              No se encontro data
            </div>
          )}
          <ModalFooter>
            <Button
              color='primary'
              onClick={() =>
                dispatch(setModal_contartos(!store.modal_contratos))
              }>
              Aceptar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}
export default ModalFormContratos
