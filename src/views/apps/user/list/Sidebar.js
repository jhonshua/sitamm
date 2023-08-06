// ** React Import
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

// ** Reactstrap Imports
import { Button, Label, Form, Input, Spinner, FormFeedback } from 'reactstrap'
import logo from '../../../../assets/images/logo/logo.png'
// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { addUser, setSidebar, setUser, updateUser } from '../store'
import { getData as getRoles } from '../../roles-permissions/store/index'
import { getData as getCompanies } from '../../companies/store'
const toInputNumbersOnly = e => {
  e.target.value = ("" + e.target.value).replace(/[^0-9]+$/, '');
};
const toInputletterOnly = e => {
  e.target.value = ("" + e.target.value).replace(/[^a-zA-ZşŞıİçÇöÖüÜĞğ\- ]/g, '')
};
const defaultValues = {
  full_name: '',
  username: '',
  email: '',
  phone: '',
  country: null,
  rol_id: null,
  company_id: null,
}

const countryOptions = [
  { label: 'Australia', value: 'Australia' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Belarus', value: 'Belarus' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Canada', value: 'Canada' },
  { label: 'China', value: 'China' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Korea', value: 'Korea' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Russia', value: 'Russia' },
  { label: 'South', value: 'South' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
]

const SidebarNewUsers = () => {
  // ** States
  const [data, setData] = useState(null)
  const [apiErrors, setErrors] = useState(null)
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const roles = useSelector(state => state.permissions)
  const store = useSelector(state => state.users)
  const companies = useSelector(state => state.companies)

  // ** Store Vars
  const dispatch = useDispatch()

  useEffect(() => {
    if (store.error) {
      if (store.error.errors && Object.keys(store.error.errors).length) {
        setErrors(store.error?.errors)
        // Show toast error for each error
        for (const sKey in store.error?.errors) {
          toast.error(store.error?.errors[sKey])
        }
      } else {
        toast.error(store.error.message)
      }
    }
  }, [store?.error])
  //get roles*
  useEffect(() => {
    dispatch(
      getRoles({
        sort: 'desc',
        sortColumn: 'id',
        q: '',
        page: 1,
        perPage: 50,
      })
    )
  }, [dispatch])
  //get company*
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
  //errors
  useEffect(() => {
    if (apiErrors) {
      for (const sKey in apiErrors) {
        setError(sKey, { type: 'manual', message: apiErrors[sKey] })
      }
    }
  }, [apiErrors])

  // ** Vars
  const {
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (store.selectedUser) {
      let oData = { ...store.selectedUser }

      if (oData.country) {
        const oCountry = countryOptions.find(
          oItem => oItem.label === oData.country
        )

        if (oCountry) {
          oData.country = oCountry
        } else {
          oData.country = null
        }
      }

      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }
      setRole(oData.rol_id)
    }
  }, [store?.selectedUser])

  const toggleSidebar = () => {
    dispatch(setSidebar(!store.sidebar))
    dispatch(setUser(null))
  }

  // ** Function to handle form submit
  const onSubmit = data => {
    const oSend = { ...data, company_id: company }
    setData(data)

    if (!oSend.phone || oSend.phone === '') {
      delete oSend.phone
    }

    if (!oSend.company_id || oSend.company_id === '') {
      delete oSend.company_id
    }
    console.log(oSend)
    console.log(store?.selectedUser?._id)
    if (store?.selectedUser?._id) {
      dispatch(
        updateUser({
          id: store.selectedUser._id,
          user: {
            ...oSend,
            country: oSend.country.value,
            rol_id: role,
          },
        })
      )
    } else {
      dispatch(
        addUser({
          ...oSend,
          country: oSend.country.value,
          rol_id: role,
        })
      )
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setRole('subscriber')
    setPlan('basic')
  }

  return (
    <Sidebar
      size='lg'
      open={store?.sidebar || false}
      title=''
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}>
      <div className='mb-1'>
        <h2>
          <img src={logo} height='30' width='30' />
          {`${store.selectedUser ? 'Modificar' : 'Nuevo'} Usuario`}
        </h2>{' '}
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='full_name'>
            Nombre completo <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='full_name'
            control={control}
            render={({ field }) => (
              <Input
                id='full_name'
                onInput={toInputletterOnly}
                placeholder='campo requerido'
                {...register('full_name', {
                  required: true,
                  maxLength: 50,
                  pattern: /^[A-Za-z\s]*$/,
                })}
                invalid={errors.full_name && true}
                {...field}
              />
            )}
          />
          {errors.full_name && (
            <FormFeedback>Debe tener minimo 3 caracteres {errors.full_name.message}</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='username'>
            Nombre de usuario <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <Input
                id='username'
                placeholder='campo requerido'
                {...register('username', {
                  required: true,
                  maxLength: 10,
                })}
                invalid={errors.username && true}
                {...field}
              />
            )}
          />
          {errors.username && (
            <FormFeedback>Debe tener minimo 3 caracteres {errors.username.message}</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='email'>
            Correo electrónico <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='email'
                placeholder='Ejemplo@gmail.com'
                {...register('email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                })}
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          {errors.email && (
            <FormFeedback>Debe ser un correo valido</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='phone'>
            Teléfono <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <Input
                id='phone'
                onInput={toInputNumbersOnly}
                placeholder='2944565153'
                invalid={errors.phone && true}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='country'>
            País <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={countryOptions}
                theme={selectThemeColors}
                className={classnames('react-select', {
                  'is-invalid': data !== null && data.country === null,
                })}
                {...field}
              />
            )}
          />
        </div>
        {!store.selectedUser &&  (<div className='mb-1'>
          <Label className='form-label' for='user-role'>
            Rol
          </Label>
          <Input
            type='select'
            id='user-role'
            name='rol_id'
            value={role}
            onChange={e => setRole(e.target.value)}>
            {roles.data?.filter(rol => { return !rol.name.includes('API') && !rol.name.toUpperCase().includes('EMPLEADO') && !rol.name.toUpperCase().includes('EMPRESA'); }).map(oRole => (
              <option key={oRole._id} value={oRole._id}>
                {oRole.name}
              </option>
            ))}
          </Input>
        </div>)
      }
        {role === '63b461fb81dbdf0018026fec' && (
          <div
            className='mb-1'
            value={company}
            onChange={e => setCompany(e.target.value)}>
            <Label className='form-label' for='select-plan'>
              Seleccionar Compañia
            </Label>
            <Input type='select' id='select-plan' name='select-plan'>
              {companies.data?.map(oCompany => (
                <option key={oCompany._id} value={oCompany._id}>
                  {oCompany.name}
                </option>
              ))}
            </Input>
          </div>
        )}
        <Button
          disabled={store.loading}
          type='submit'
          className='me-1'
          color='primary'>
          {store.loading ? <Spinner color='light' /> : 'Guardar'}
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancelar
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
