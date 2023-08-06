// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// import { get_api_url } from '../../../../utility/url'
import { toast } from 'react-toastify'
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
// ** Styles
import '@styles/react/pages/page-form-validation.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const QUERY = `/employees?rfc[$regex]=`
// ** Reactstrap Imports
import {
  Row,
  Col,
  Modal,
  Input,
  Button,
  Label,
  ModalBody,
  ModalHeader,
} from 'reactstrap'
import logo from '../../../assets/images/logo/logo.png'
// import Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  setModal,
  setbenefitCategory,
  addbenefitCategory,
  updateCategory,
} from './store'
// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'

const defaultValues = {
  name: '',
  description: '',
  company_id: [],
  status: 1,
}

const animatedComponents = makeAnimated()

const CreateCategory = () => {
  // ** States
  const [data, setData] = useState(null)
  const [company, setCompany] = useState([])
  const [apiErrors, setErrors] = useState(null)
  const [companyOptions, setCompanyOptions] = useState([])
  const [companyOptionsSelectd, setCompanyOptionsSelected] = useState([])

  //state fonce reload state selec company
  const [companyOptionsKey, setCompanyOptionsKey] = useState(Date.now())
  const store = useSelector(state => state.benefitCategory)
  const companies = useSelector(state => state.companies)
  const user = useSelector(state => state.auth.userData)
  const dispatch = useDispatch()
  //  on Mound
  useEffect(() => {
    if (companies) {
      const options = companies.data.map(company => ({
        label: company.name,
        value: company._id,
        color: '#00B8D9',
        sFixed: true,
      }))
      setCompanyOptionsSelected(options)
    }
  }, [companies.data])

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
    if (store.selectedCategory) {
      const oData = { ...store.selectedCategory }
      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }

      const options = companies.data
        .filter(company =>
          store.selectedCategory.company_id.includes(company._id)
        )
        .map(company => ({
          label: company.name,
          value: company._id,
          color: '#00B8D9',
          sFixed: true,
        }))

      setCompanyOptions(options)
      setCompanyOptionsKey(Date.now())
    }
  }, [store?.selectedCategory])

  //reset value sidebar
  const handleSidebarClosed = () => {
    for (const sKey in defaultValues) {
      setValue(sKey, '')
    }
  }

  const toggleModal = async () => {
    await dispatch(setModal(!store.modal))
    await dispatch(setbenefitCategory())
    await handleSidebarClosed()
    setCompanyOptions([])
  }

  const onSubmit = data => {
    setData(data)
    const selectedCompanies = companyOptions[0].map(option => option.value)
    const datos = {
      ...data,
      company_id: selectedCompanies,
    }
    if (store?.selectedCategory?._id) {
      dispatch(
        updateCategory({
          ...datos,
          id: store.selectedCategory._id,
        })
      )
    } else {
      dispatch(addbenefitCategory({ ...datos }))
    }
    dispatch(setModal(!store.modal))
  }

  const handleSelectChange = data => {
    setCompanyOptions([data])
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
            <h1 className='mb-1'><img
              src={logo}
              height='30'
              width='30'
            /> Agregar Categoria </h1>
          </div>
          <Row
            tag='form'
            className='gy-1 pt-75'
            onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className='form-label' for='name'>
                Nombre del Categoria
              </Label>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='name' invalid={errors.name && true} />
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
            <Col xs={12} className='mb-1' sm='12'>
              <Label className='form-label'>Selecionar Compañias</Label>
              <Select
                key={companyOptionsKey}
                isClearable={false}
                theme={selectThemeColors}
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={companyOptions}
                isMulti
                options={companyOptionsSelectd}
                className='react-select'
                classNamePrefix='select'
                onChange={handleSelectChange}
              />
            </Col>
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
export default CreateCategory
