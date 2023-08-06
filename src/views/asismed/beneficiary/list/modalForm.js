// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { apiCall, CREATE, FIND, UPDATE, GET } from '../../../../service/api'
import { get_api_url } from '../../../../utility/url'
import { ToastContainer, toast } from 'react-toastify'

// ** Third Party Components
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import AsyncSelect from 'react-select/async'
import axios from 'axios'

// ** Styles
import '@styles/react/pages/page-form-validation.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const QUERY = `/employees?rfc[$regex]=`
// ** Reactstrap Imports
import {
  Form,
  Col,
  Modal,
  Input,
  Label,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback,
} from 'reactstrap'

// import Redux
import { useDispatch, useSelector } from 'react-redux'
import { setModal, setBeneficiary, addBeneficiary } from '../store'

// ** Third Party Components
import { getData, getEmployee } from '../../../apps/employees/store'
import { useForm, Controller } from 'react-hook-form'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
let result = []

const defaultValues = {
  _id: '',
  name: '',
  last_name: '',
  mothers_name: '',
  rfc: '',
  bank: '',
  account: '',
  account_name: '',
  clabe: '',
  company_id: '',
  num_membresia: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: '',
  curp: '',
  email: '',
  telefono: '',
  calle: '',
  nro_interior: '',
  nro_exterior: '',
  colonia: '',
  codigo_postal: '',
  entre_calle_1: '',
  entre_calle_2: '',
  fecha_inicio_servicio: '',
  fecha_fin_servicio: '',
  id: 0,
  employee_id: '',
}

const EditUserExample = () => {
  // ** States
  const [data, setData] = useState(null)
  const [apiErrors, setErrors] = useState(null)
  let state = {
    selectedEmployee: '',
  }
  const searchCustomer = employeeRFC => {
    console.log('searching for', employeeRFC)
    let searchTerm = employeeRFC

    // FIX:
    //The default set of options to show before the user
    // starts searching. When set to true, the results for
    // loadOptions('') will be autoloaded.

    if (!employeeRFC || employeeRFC === ' ') {
      searchTerm = ''
    }
    const urlRequest = `${get_api_url()}${QUERY}${searchTerm}`
    console.log(urlRequest)
    let newRequest = axios.get(urlRequest).then(response => {
      result = response.data.data.map(employee => ({
        label: employee.rfc,
        value: employee._id,
      }))
      return result
    })
    console.log('newRequest', newRequest)
    return newRequest
  }
  //** Store
  const store = useSelector(state => state.beneficiary)
  const employees = useSelector(state => state.employees)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      getData({
        sort: 'desc',
        sortColumn: 'id',
        q: '',
        page: 1,
        perPage: 10,
        status: '',
      })
    )
  }, [dispatch])

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
    register,
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
    if (store.selectedBeneficiary) {
      const oData = { ...store.selectedBeneficiary }

      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }
    }
  }, [store?.selectedBeneficiary])

  //reset value sidebar
  const handleSidebarClosed = () => {
    for (const sKey in defaultValues) {
      setValue(sKey, '')
    }
  }

  const toggleModal = () => {
    dispatch(setModal(!store.modal))
    dispatch(setBeneficiary())
    handleSidebarClosed()
  }

  const handleEmployeId = e => {
    state.selectedEmployee = e.value
    const _id = e.value
    dispatch(getEmployee(_id))
  }

  useEffect(() => {
    dispatch(setBeneficiary(employees.empleado))
  }, [employees.empleado])

  const onSubmit = data => {
    setData(data)
    const datos = {
      nombre: data.name,
      num_membresia: data.num_membresia,
      apellido_paterno: data.last_name,
      apellido_materno: data.mothers_name,
      fecha_nacimiento: `${data.fecha_nacimiento[0]}`,
      curp: data.curp,
      rfc: data.rfc,
      email: data.email,
      telefono: data.telefono,
      calle: data.calle,
      nro_interior: data.nro_interior,
      nro_exterior: data.nro_exterior,
      colonia: data.colonia,
      codigo_postal: data.codigo_postal,
      entre_calle_1: data.entre_calle_1,
      entre_calle_2: data.entre_calle_2,
      fecha_inicio_servicio: `${data.fecha_inicio_servicio[0]}`,
      fecha_fin_servicio: `${data.fecha_fin_servicio[0]}`,
      employee_id: data._id,
    }
    console.log(data)
    dispatch(addBeneficiary(datos))
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
            <h1 className='mb-1'> Agregar beneficiario </h1>
          </div>
          <Form
            tag='form'
            className='gy-1 pt-75'
            onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className='form-label' for='employee_id'>
                Seleccionar afiliado <span className='text-danger'>*</span>
              </Label>
              <AsyncSelect
                // This is the example that the list was cleared (FIXED)
                cacheOptions
                defaultOptions
                value={state.selectedEmployee}
                loadOptions={searchCustomer}
                onChange={e => {
                  handleEmployeId(e)
                }}
                id='employee_id'
                name='employee_id'
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='last_name'>
                Nombre del afiliado
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
              <Label className='form-label' for='last_name'>
                Apellido paterno
              </Label>
              <Controller
                name='last_name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='last_name'
                    invalid={errors.last_name && true}
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='mothers_name'>
                Apellido materno
              </Label>
              <Controller
                name='mothers_name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='mothers_name'
                    invalid={errors.mothers_name && true}
                  />
                )}
              />
              {errors.mothers_name && (
                <FormFeedback>
                  Por favor ingrese un apellido válido
                </FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Controller
                control={control}
                name='_id'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      type='hidden'
                      id='_id'
                      invalid={errors._id && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='account_name'>
                Nombre de Cuenta
              </Label>
              <Controller
                control={control}
                name='account_name'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='account_name'
                      invalid={errors.account_name && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='company_id'>
                Id de la empresa
              </Label>
              <Controller
                control={control}
                name='company_id'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='company_id'
                      invalid={errors.company_id && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='rfc'>
                rfc
              </Label>
              <Controller
                control={control}
                name='rfc'
                render={({ field }) => {
                  return (
                    <Input {...field} id='rfc' invalid={errors.rfc && true} />
                  )
                }}
              />
            </Col>
            <div className='text-center  '>
              <h4 className='mb-1 text-muted'>informacion secundaria</h4>
            </div>
            <Col xs={12}>
              <Controller
                control={control}
                name='num_membresia'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='num_membresia'
                      type='hidden'
                      invalid={errors.num_membresia && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='fecha_nacimiento'>
                Fecha de nacimiento <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='fecha_nacimiento'
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    options={{ allowInput: true }}
                    invalid={errors.fecha_nacimiento && true}
                    className={classnames('form-control', {
                      'is-invalid':
                        data !== null && data.fecha_nacimiento === null,
                    })}
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='pais'>
                PAÍS<span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='pais'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('pais', { required: true, maxLength: 20 })}
                      {...field}
                      id='pais'
                      invalid={errors.pais && true}
                    />
                  )
                }}
              />
              {errors.pais && (
                <FormFeedback>Campo requerido max 20 caracteres</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='estado'>
                Estado<span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='estado'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('estado', { required: true, maxLength: 20 })}
                      {...field}
                      id='estado'
                      invalid={errors.estado && true}
                    />
                  )
                }}
              />
              {errors.estado && (
                <FormFeedback>Campo requerido max 20 caracteres</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='ciudad_alcalcia'>
                Ciudad Alcaldía<span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='ciudad_alcalcia'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('ciudad_alcalcia', {
                        required: true,
                        maxLength: 20,
                      })}
                      {...field}
                      id='ciudad_alcalcia'
                      invalid={errors.ciudad_alcalcia && true}
                    />
                  )
                }}
              />
              {errors.ciudad_alcalcia && (
                <FormFeedback>Campo requerido max 20 caracteres</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='curp'>
                curp <span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='curp'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('curp', { required: true, maxLength: 18 })}
                      {...field}
                      id='curp'
                      invalid={errors.curp && true}
                    />
                  )
                }}
              />
              {errors.curp && (
                <FormFeedback>Campo requerido max 18 digitos</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='email'>
                Correo electrónico <span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='email'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('email', {
                        required: true,
                        max: 19,
                        min: 5,
                        maxLength: 40,
                        pattern: /^\S+@\S+$/i,
                      })}
                      {...field}
                      id='email'
                      type='email'
                      placeholder='example@domain.com'
                      invalid={errors.email && true}
                    />
                  )
                }}
              />
              {errors.email && (
                <FormFeedback>Ingrese correo valido </FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='telefono'>
                Telefono <span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='telefono'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('telefono', {
                        required: true,
                        maxLength: 10,
                      })}
                      {...field}
                      id='telefono'
                      placeholder='numero tlf celeular '
                      invalid={errors.telefono && true}
                    />
                  )
                }}
              />
              {errors.email && (
                <FormFeedback>Ingrese numero tlf 10 digitos </FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='calle'>
                Calle <span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='calle'
                render={({ field }) => {
                  return (
                    <Input
                      {...register('calle', { required: true, maxLength: 18 })}
                      {...field}
                      id='calle'
                      invalid={errors.calle && true}
                    />
                  )
                }}
              />
              {errors.calle && (
                <FormFeedback>campo requerido ingrese calle </FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='nro_interior'>
                Nro Interior
              </Label>
              <Controller
                control={control}
                name='nro_interior'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='nro_interior'
                      invalid={errors.nro_interior && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='nro_exterior'>
                Nro Exterior
              </Label>
              <Controller
                control={control}
                name='nro_exterior'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='nro_exterior'
                      invalid={errors.nro_exterior && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='colonia'>
                Colonia
              </Label>
              <Controller
                control={control}
                name='colonia'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='colonia'
                      invalid={errors.colonia && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='codigo_postal'>
                Codigo postal <span className='text-danger'>*</span>
              </Label>
              <Controller
                control={control}
                name='codigo_postal'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='codigo_postal'
                      invalid={errors.codigo_postal && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='entre_calle_1'>
                Entre calle 1
              </Label>
              <Controller
                control={control}
                name='entre_calle_1'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='entre_calle_1'
                      invalid={errors.entre_calle_1 && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='entre_calle_2'>
                Entre calle 2
              </Label>
              <Controller
                control={control}
                name='entre_calle_2'
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      id='entre_calle_2'
                      invalid={errors.entre_calle_2 && true}
                    />
                  )
                }}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='fecha_inicio_servicio'>
                fecha de inicio del servicio{' '}
                <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='fecha_inicio_servicio'
                id='fecha_inicio_servicio'
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    options={{ allowInput: true }}
                    invalid={errors.fecha_inicio_servicio && true}
                    className={classnames('form-control', {
                      'is-invalid':
                        data !== null && data.fecha_inicio_servicio === null,
                    })}
                  />
                )}
              />
            </Col>
            <Col xs={12}>
              <Label className='form-label' for='fecha_fin_servicio'>
                fecha de fin de servicio <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='fecha_fin_servicio'
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    {...field}
                    options={{ allowInput: true }}
                    invalid={errors.fecha_fin_servicio && true}
                    className={classnames('form-control', {
                      'is-invalid':
                        data !== null && data.fecha_fin_servicio === null,
                    })}
                  />
                )}
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
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}
export default EditUserExample
