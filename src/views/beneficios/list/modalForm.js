// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// import { get_api_url } from '../../../../utility/url'
import { ToastContainer, toast } from 'react-toastify'

// ** Styles
import '@styles/react/pages/page-form-validation.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import logo from '../../../assets/images/logo/logo.png'
// ** Third Party Components
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

const QUERY = `/employees?rfc[$regex]=`
// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  Input,
  Label,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from 'reactstrap'

// import Redux
import { useDispatch, useSelector } from 'react-redux'
import { setModal, setbenefit, addbenefit, updateBenefit } from './store'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const defaultValues = {
  title: '',
  description: '',
  phone: '',
  link: '',
  category_id: '',
  status: 1,
  multimedia_id: '',
}
const codNumber = [
  { code: '+54', abbreviation: 'AR' },
  { code: '+591', abbreviation: 'BO' },
  { code: '+55', abbreviation: 'BR' },
  { code: '+56', abbreviation: 'CL' },
  { code: '+57', abbreviation: 'CO' },
  { code: '+506', abbreviation: 'CR' },
  { code: '+53', abbreviation: 'CU' },
  { code: '+1809', abbreviation: 'DO' },
  { code: '+593', abbreviation: 'EC' },
  { code: '+503', abbreviation: 'SV' },
  { code: '+502', abbreviation: 'GT' },
  { code: '+509', abbreviation: 'HT' },
  { code: '+504', abbreviation: 'HN' },
  { code: '+52', abbreviation: 'MX' },
  { code: '+505', abbreviation: 'NI' },
  { code: '+507', abbreviation: 'PA' },
  { code: '+595', abbreviation: 'PY' },
  { code: '+51', abbreviation: 'PE' },
  { code: '+1787', abbreviation: 'PR' },
  { code: '+1', abbreviation: 'TT' },
  { code: '+598', abbreviation: 'UY' },
  { code: '+58', abbreviation: 'VE' },
]

const EditUserExample = () => {
  // ** States
  const [data, setData] = useState(null)
  const [category, setCategory] = useState('')
  const [apiErrors, setErrors] = useState(null)
  const options = { phone: true, phoneRegionCode: 'US' }
  const [zoneCode, setZoneCode] = useState('')
  //** Store
  const store = useSelector(state => state.benefit)
  const categories = useSelector(state => state.benefitCategory)
  const user = useSelector(state => state.auth.userData)
  const dispatch = useDispatch()

  //errors
  useEffect(() => {
    if (store.error) {
      if (store.error.errors && Object.keys(store.error.errors).length) {
        setErrors(store.error?.errors)
        for (const sKey in store.error?.errors) {
          toast.error(store.error?.errors[sKey])
        }
      } else {
        toast.error(store.error.message)
      }
    }
  }, [store?.error])

  // ** Hooks
  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  //api  errors
  useEffect(() => {
    if (apiErrors) {
      for (const sKey in apiErrors) {
        setError(sKey, { type: 'manual', message: apiErrors[sKey] })
      }
    }
  }, [apiErrors])

  //loading data in modal
  useEffect(() => {
    if (store.selectedBenefit) {
      const oData = { ...store.selectedBenefit }

      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }
    }
  }, [store?.selectedBenefit])

  //reset value sidebar
  const handleSidebarClosed = () => {
    for (const sKey in defaultValues) {
      setValue(sKey, '')
    }
  }

  const toggleModal = () => {
    dispatch(setModal(!store.modal))
    dispatch(setbenefit())
    handleSidebarClosed()
  }

  const onSubmit = data => {
    setData(data)
    const datos = {
      ...data,
      category_id: category,
      phone: `${zoneCode} ${data.phone}`,
    }
    if (store?.selectedBenefit?._id) {
      dispatch(
        updateBenefit({
          ...datos,
          id: store.selectedBenefit._id,
        })
      )
    } else {
      dispatch(addbenefit({ ...datos }))
    }
    dispatch(setModal(!store.modal))
  }

  return (
    <Fragment>
      <Modal
        isOpen={store.modal}
        toggle={toggleModal}
        className='modal-dialog-centered modal-lg'>
        <ModalHeader
          className='bg-transparent'
          toggle={toggleModal}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'> <img
              src={logo}
              height='30'
              width='30'
            />Agregar Beneficio </h1>
          </div>
          <Row
            tag='form'
            className='gy-1 pt-75'
            onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className='form-label' for='title'>
                Titulo del Beneficio
              </Label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='title' invalid={errors.title && true} />
                )}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='description'>
                Descripcion
              </Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='description'
                    invalid={errors.description && true}
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='phone'>
                Telefono
              </Label>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <InputGroup className='input-group-merge'>
                    <InputGroupText>
                      <select
                        className='form-select'
                        onChange={e => setZoneCode(e.target.value)}>
                        <option value={''}>Pais</option>
                        {codNumber.map(code => (
                          <option key={code.code} value={code.code}>
                            {`${code.abbreviation}  (${code.code})`}
                          </option>
                        ))}
                      </select>
                    </InputGroupText>
                    <Cleave
                      {...field}
                      className='form-control'
                      placeholder='1 234 567 8900'
                      options={options}
                      id='phone'
                      invalid={errors.phone && true}
                    />
                  </InputGroup>
                )}
              />

              {errors.phone && (
                <FormFeedback>
                  Por favor ingrese un numbero de telefono valido
                </FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='link'>
                enlace
              </Label>
              <Controller
                name='link'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='link' invalid={errors.link && true} />
                )}
              />
              {errors.link && (
                <FormFeedback>Por favor ingrese un enlace valido</FormFeedback>
              )}
            </Col>
            <Col
              xs={12}
              value={category}
              onChange={e => setCategory(e.target.value)}>
              <Label className='form-label' for='select-category'>
                Seleccionar Categoria
              </Label>
              <Controller
                name='category_id'
                control={control}
                render={() => (
                  <Input
                    type='select'
                    id='select-category'
                    name='select-category'
                    disabled={user?.rol === 'company'}
                    invalid={errors.category_id && true}>
                    {user.rol === 'company' && user?.company?._id ? (
                      <option value={user?.company?._id}>
                        {
                          categories.data?.find(
                            category => category._id === user?.company?._id
                          )?.name
                        }
                      </option>
                    ) : store?.selectedBenefit?.category_id &&
                      user.rol === 'admin' ? (
                      <option value={store?.selectedBenefit?.category_id}>
                        {
                          categories.data?.find(
                            category =>
                              category._id ===
                              store?.selectedBenefit?.category_id
                          )?.name
                        }
                      </option>
                    ) : (
                      <option value=''>Seleccione Categoria</option>
                    )}

                    {categories.data?.map(category =>
                      store?.selectedBenefit?.category_id ? (
                        category._id !== store.selectedBenefit.category_id && (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        )
                      ) : category?.status !== 0 ? (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ) : (
                        <></>
                      )
                    )}
                  </Input>
                )}
              />
            </Col>
            {/* <Col xs={12}>
              <Label className='form-label' for='multimedia_id'>
                Multimedia_id
              </Label>
              <Controller
                name='multimedia_id'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='multimedia_id'
                    invalid={errors.multimedia_id && true}
                  />
                )}
              />
            </Col> */}
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='primary'>
                Guardar
              </Button>
              <Button
                type='reset'
                color='primary'
                outline
                onClick={toggleModal}>
                Descartar
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}
export default EditUserExample
