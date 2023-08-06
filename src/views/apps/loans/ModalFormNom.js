// ** React Imports
import { useEffect } from 'react'
import { setModal_Nom, getData_multimedia_Nom } from './store'
import { useDispatch, useSelector } from 'react-redux'
// ** Reactstrap Imports
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import logo from '../../../assets/images/logo/logo.png'
const ModalFormNom = () => {
  // ** States
  const dispatch = useDispatch()
  const store = useSelector(state => state.loans)
  let base64_data = store?.selectedLoan?.nom151_response?.response?.data?.constancia_pdf
  useEffect(() => {
    //dispatch(getData_multimedia_Nom(base64_data))
    base64_data = store?.selectedLoan?.nom151_response?.response?.data?.constancia_pdf
  }, [store.modal_Nom])

  return (
    <div className='demo-inline-spacing'>
      <div>
        <Modal
          isOpen={store.modal_Nom || false}
          toggle={() => dispatch(setModal_Nom(!store.modal_Nom))}>
          <ModalHeader toggle={() => dispatch(setModal_Nom(!store.modal_Nom))}>
            <h2>
              <img src={logo} height='40' width='40' />
              Nom
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
                height: '50vh',
              }}>
              No se encontro data
            </div>
          )}
          <ModalFooter>
            <Button
              color='primary'
              onClick={
                () => dispatch(setModal_Nom(!store.modal_Nom))
                //dispatch(setMultimedia(false))
              }>
              Aceptar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}
export default ModalFormNom
