// ** React Import
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

import logo from '../../../../assets/images/logo/logo.png'
// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Input,
  Spinner,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { addEmployee, setSidebar, setEmployee, updateEmployees } from '../store'
import { getData as getRoles } from '../../roles-permissions/store/index'
import { getData as getCompanies } from '../../companies/store'
import { bankList } from './banks'

//defaul values form sidebar

const defaultValues = {
  account: '',
  name: '',
  clabe: '',
  max_amount: '',
  min_amount: '',
  company_id: null,
  last_name: '',
  mothers_name: '',
  phone_number: '',
  rfc: '',
  curp: '',
  bank: '',
  email: '',
  total_perception: '',
  account_name: '',
  total_deduction: '',
  liquidity: '',
}
const toInputletterOnly = e => {
  e.target.value = ('' + e.target.value).replace(
    /[^a-zA-ZşŞıİçÇöÖüÜĞğ\- ]/g,
    ''
  )
}
const toInputNumbersOnly = e => {
  e.target.value = ("" + e.target.value).replace(/[^0-9]+$/, '');
};
const toInputUppercase = e => {
  e.target.value = ("" + e.target.value).toUpperCase();
};
const SidebarNewUsers = () => {
  // ** States
  const [data, setData] = useState(null)
  const [apiErrors, setErrors] = useState(null)
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [bank, setBank] = useState('')
  const store = useSelector(state => state.employees)
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
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  // ** preload selected employee info
  useEffect(() => {
    if (store.selectedUser) {
      const oData = { ...store.selectedUser }
      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }
      setCompany(store?.selectedUser?.company_id)
      setBank(store?.selectedUser?.bank)
    }
  }, [store?.selectedUser])

  //*Function togglesidebar

  const toggleSidebar = () => {
    dispatch(setSidebar(!store.sidebar))
  }

  // ** Function to handle form submit
  const onSubmit = data => {
    const oSend = { ...data, company_id: company }
    oSend.bank = bank
    setData(data)
    if (store.selectedUser) {
      const _id = store.selectedUser._id
      const update = { ...oSend, _id }
      dispatch(updateEmployees(update))
    } else {
      dispatch(addEmployee({ ...oSend }))
    }
  }

  //** Function to handle closed sidebar */
  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setRole('subscriber')
    setPlan('basic')
    dispatch(setEmployee(false))
  }

  return (
    <Sidebar
      size='lg'
      title=''
      open={store?.sidebar || false}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}>
      <div className='mb-1'>
        <h2>
          <img src={logo} height='30' width='30' />
          {`${store.selectedUser ? 'Modificar' : 'Nuevo'} Afiliado`}
        </h2>{' '}
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='name'>
            Nombre <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                id='name'
                onInput={toInputletterOnly}
                placeholder='campo requerido'
                {...register('name', {
                  required: true,
                  maxLength: 20,
                  pattern: /^[a-zA-Z]+$/,
                })}
                invalid={errors.name && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>Nombre debe tener min 3 caracteres</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='last_name'>
            Apellido Paterno <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='last_name'
            control={control}
            render={({ field }) => (
              <Input
                id='last_name'
                onInput={toInputletterOnly}
                placeholder='campo requerido'
                {...register('last_name', {
                  required: true,
                  maxLength: 20,
                  pattern: /^[A-za-z]+$/,
                })}
                invalid={errors.last_name && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>
              Apellido Paterno debe tener min 3 caracteres
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='mothers_name'>
            Apellido materno <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='mothers_name'
            control={control}
            render={({ field }) => (
              <Input
                id='mothers_name'
                placeholder='campo requerido'
                onInput={toInputletterOnly}
                {...register('mothers_name', { required: true, max: 50 })}
                invalid={errors.mothers_name && true}
                {...field}
              />
            )}
          />
          {errors.mothers_name && (
            <FormFeedback>
              Apellido Materno debe tener min 3 caracteres
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='phone_number'>
            Telefono <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='phone_number'
            control={control}
            rules={{
              validate: value => value.length === 10,
            }}
            render={({ field }) => (
              <Input
                id='phone_number'
                placeholder='5551234825'
                onInput={toInputNumbersOnly}
                {...register('phone_number', {
                  required: true,
                  pattern: /^[0-9]+$/,
                })}
                invalid={errors.phone_number && true}
                {...field}
              />
            )}
          />
          {errors.name && <FormFeedback> Debe tener 10 numeros</FormFeedback>}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rfc'>
            Correo electrónico <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
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
          {errors.name && (
            <FormFeedback>Debe ser un correo valido</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rfc'>
            RFC <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='rfc'
            control={control}
            render={({ field }) => (
              <Input
                id='rfc'
                onInput={toInputUppercase}
                placeholder='ingrese 13 digitos'
                {...register('rfc', {
                  required: true,
                  maxLength: 13,
                  pattern:
                    /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
                })}
                invalid={errors.rfc && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>
              Deberia tener 13 digitos para persona Fisica o 12 para persona
              mora
            </FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rfc'>
            CURP <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='curp'
            control={control}
            render={({ field }) => (
              <Input
                id='curp'
                placeholder='ingrese 18 caracteres'
                onInput={toInputUppercase}
                {...register('curp', {
                  required: true,
                  maxLength: 18,
                  minLength: 17,
                  pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
                })}
                invalid={errors.curp && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>El formato de la curp no es correcto</FormFeedback>
          )}
        </div>
        {/* <div className='mb-1'>
          <Label className='form-label' for='account_name'>
            Cuenta <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='account_name'
            control={control}
            render={({ field }) => (
              <Input
                id='account_name'
                placeholder='ingrese 13 digitos'
                {...register('account_name', { required: true, maxLength: 40 })}
                invalid={errors.account_name && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>cuenta deberia tener min 3 caracteres</FormFeedback>
          )}
        </div> */}
        <div className='mb-1'>
          <Label
            className='form-label'
            for='bank'
            value={bank}
            onChange={e => setBank(e.target.value)}>
            Banco <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='bank'
            control={control}
            render={() => (
              <Input
                type='select'
                id='select-bank'
                name='select-bank'
                onChange={e => setBank(e.target.value)}
                invalid={errors.bank && true}>
                {store?.selectedEmployee?.bank ? (
                  <>
                    <option value={store?.selectedEmployee?.bank}>
                      {
                        bankList.find(
                          bank => bank.value === store?.selectedEmployee?.bank
                        )?.label
                      }
                    </option>
                    {bankList?.map((bank, i) =>
                      store?.selectedEmployee?.bank ? (
                        bank.value !== store.selectedEmployee.bank && (
                          <option key={i} value={bank.value}>
                            {bank.label}
                          </option>
                        )
                      ) : (
                        <option key={i} value={bank.value}>
                          {bank.label}
                        </option>
                      )
                    )}
                  </>
                ) : (
                  <>
                    <option value=''>Selecciona un banco</option>
                    {bankList.map((bank, i) => {
                      return (
                        <option value={bank.value} key={i}>
                          {bank.label}
                        </option>
                      )
                    })}
                  </>
                )}
              </Input>
            )}
          />
          {errors.name && (
            <FormFeedback>Banco deberia tener min 3 caracteres</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='account'>
            Numero de cuenta <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='account'
            control={control}
            render={({ field }) => (
              <Input
                id='account'
                placeholder='ingrese 10 a 13 digitos'
                type='number'
                {...register('account', { required: true, maxLength: 30 })}
                invalid={errors.account && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>Cuenta deberia tener min 10 digitos</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='clabe'>
            Clabe <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='clabe'
            control={control}
            render={({ field }) => (
              <Input
                type='number'
                placeholder='ingrese los 18 digitos'
                id='clabe'
                {...register('clabe', { required: true, maxLength: 18, minLength: 18})}
                invalid={errors.clabe && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>La CLABE interbancaria debe tener 18 digitos</FormFeedback>
          )}
        </div>
        <div
          className='mb-1'
          value={company}
          onChange={e => setCompany(e.target.value)}>
          <Label className='form-label' for='select-plan'>
            Seleccionar Compañia
          </Label>
          <Input type='select' id='select-plan' name='select-plan'>
            <option value=''>Seleccionar compañia</option>
            {companies.data?.map(oCompany => (
              <option key={oCompany._id} value={oCompany._id}>
                {oCompany.name}
              </option>
            ))}
          </Input>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='total_perception'>
            Perception total
          </Label>
          <Controller
            name='total_perception'
            control={control}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id='total_perception'
                  type='number'
                  placeholder='100'
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='total_deduction'>
            Deducción total
          </Label>
          <Controller
            name='total_deduction'
            control={control}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id='total_deduction'
                  type='number'
                  placeholder='100'
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='liquidity'>
            Liquidez
          </Label>
          <Controller
            name='liquidity'
            control={control}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id='liquidity'
                  type='number'
                  placeholder='10'
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='max_amount'>
            Prestamo Maximo
          </Label>
          <Controller
            name='max_amount'
            control={control}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id='max_amount'
                  type='number'
                  placeholder='1000'
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='min_amount'>
            Prestamo Minimo
          </Label>
          <Controller
            name='min_amount'
            control={control}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText>$</InputGroupText>
                <Input
                  id='min_amount'
                  type='number'
                  placeholder='10'
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
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
