/*eslint semi: ["error", "always"]*/
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Controller, useForm } from 'react-hook-form'
// import Cleave from 'cleave.js/react';
import Sidebar from '@components/sidebar'
import logo from '../../../assets/images/logo/logo.png'
import { addCompany, setSidebar, updateCompany, setCompany } from './store'
import {
  Button,
  Form,
  Input,
  Label,
  Spinner,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from 'reactstrap'
import { toast } from 'react-hot-toast'
import { number } from 'yup'

const defaultValues = {
  name: '',
  trade_name: '',
  short_name: '',
  attorney: '',
  address: '',
  email: '',
  rfc: '',
  status: '',
  account: '',
  loan_data: {
    rate: '',
    min_amount: '',
    max_amount: '',
    step: '',
  },
  plan_id: '637b9eb63abc434ee18cd9d9',
}

const SidebarCompanies = () => {
  const [data, setData] = useState(null)
  const [apiErrors, setErrors] = useState(null)
  const store = useSelector(state => state.companies)

  const dispatch = useDispatch()

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

  const {
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (apiErrors) {
      for (const sKey in apiErrors) {
        setError(sKey, { type: 'manual', message: apiErrors[sKey] })
      }
    }
  }, [apiErrors])

  useEffect(() => {
    if (store.selectedCompany) {
      const oData = { ...store.selectedCompany }

      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }
    }
  }, [store?.selectedCompany])

  const toggleSidebar = () => {
    dispatch(setSidebar(!store.sidebar))
    dispatch(setCompany(null))
  }

  const onSubmit = data => {
    setData(data)
    const {
      name,
      trade_name,
      short_name,
      attorney,
      address,
      rfc,
      status,
      account,
      email,
      loan_data,
      plan_id,
    } = data

    const newCompany = {
      name,
      trade_name: `${trade_name}`.toLocaleUpperCase(),
      short_name,
      attorney,
      address,
      email,
      rfc,
      account,
      loan_data: {
        rate: Number(loan_data.rate),
        min_amount: Number(loan_data.min_amount),
        max_amount: Number(loan_data.max_amount),
        step: Number(loan_data.step),
      },
      status: Number(data.status),
      plan_id,
    }
    if (store?.selectedCompany?._id) {
      dispatch(
        updateCompany({ id: store.selectedCompany._id, company: newCompany })
      )
    } else {
      dispatch(addCompany(data))
    }
  }

  const handleSidebarClosed = () => {
    for (const sKey in defaultValues) {
      setValue(sKey, '')
    }
  }
  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };
  const toInputletterOnly = e => {
    e.target.value = ("" + e.target.value).replace(/[^a-zA-ZşŞıİçÇöÖüÜĞğ\- ]/g, '')
  };
  const toInputNumbersOnly = e => {
    e.target.value = ("" + e.target.value).replace(/^[0-9\b]+$/, '');
  };

  return (
    <Sidebar
      size='lg'
      open={store?.sidebar || false}
      headerClassName='mb-1'
      title=''
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}>
      <div className='mb-1'>
        <h2>
          <img src={logo} height='30' width='30' />
          {`${store.selectedCompany ? 'Modificar' : 'Nueva'} Empresa`}
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
                onInput={toInputUppercase}
                placeholder='Campo requerido'
                {...register('name', {
                  required: true,
                  maxLength: 35,
                  minLength: 3,
                })}
                invalid={errors.name && true}
                {...field}
              />
            )}
          />
          {errors.name && (
            <FormFeedback>Nombre debe tener mínimo 3 caracteres</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='trade_name'>
            Razon Social
          </Label>
          <Controller
            name='trade_name'
            control={control}
            render={({ field }) => (
              <Input
                id='trade_name'
                invalid={errors.trade_name && true}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='short_name'>
            Nombre abreviado
          </Label>
          <Controller
            name='short_name'
            control={control}
            render={({ field }) => (
              <Input
                id='short_name'
                onInput={toInputUppercase}
                invalid={errors.short_name && true}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='attorney'>
            Representante legal
          </Label>
          <Controller
            name='attorney'
            control={control}
            render={({ field }) => (
              <Input
                id='attorney'
                onInput={toInputletterOnly}
                invalid={errors.attorney && true}
                {...field}
              />
            )}
          />
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
          <Label className='form-label' for='status'>
            Estatus
          </Label>
          <Controller
            control={control}
            name='status'
            render={({ field }) => {
              return (
                <>
                  <Input
                    {...field}
                    type='select'
                    id='status'
                    name='status'
                    placeholder='Selecione status'
                    invalid={errors.status && true}>
                    <option key='1' value={1}>
                      Activo
                    </option>
                    <option key='2' value={2}>
                      Inactivo
                    </option>
                  </Input>
                </>
              )
            }}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='address'>
            Dirección
          </Label>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <Input
                type='text'
                id='address'
                invalid={errors.address && true}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rfc'>
            RFC <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='rfc'
            control={control}
            rules={{
              validate: value => value.length === 13,
            }}
            render={({ field }) => (
              <Input
                id='rfc'
                placeholder='Ingrese rfc 13 caracteres '
                onInput={toInputUppercase}
                {...register('rfc', {
                  required: true,
                  pattern: /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
                })}
                invalid={errors.rfc && true}
                {...field}
              />
            )}
          />
          {errors.rfc && (
            <FormFeedback>RFC debe tener 13 caracteres</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='account'>
            Cuenta bancaria <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='account'
            control={control}
            render={({ field }) => (
              <Input
                id='account'
                placeholder='Ingrese 18 caracteres'
                type='number'
                {...register('account', {
                  required: true,
                  pattern: /^[a-zA-Z0-9]+$/,
                })}
                invalid={errors.account && true}
                {...field}
              />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rate'>
            Tasa de Interes (Procentaje)<span className='text-danger'>*</span>
          </Label>
          <Controller
            name='loan_data.rate'
            control={control}
            rules={{
              validate: value =>
                !isNaN(value) &&
                parseFloat(value) > 0 &&
                parseFloat(value) < 101,
            }}
            render={({ field }) => (
              <InputGroup>
                <Input
                  id='rate'
                  invalid={errors.loan_data?.rate && true}
                  type='number'
                  placeholder='15'
                  {...field}
                />
                <InputGroupText addonType='append'>%</InputGroupText>
              </InputGroup>
            )}
          />
          {errors.name && (
            <FormFeedback>Ingrese tasa de intereses</FormFeedback>
          )}
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='min_amount'>
            Cantidad minima <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='loan_data.min_amount'
            control={control}
            rules={{
              validate: value => !isNaN(value) && parseFloat(value) > 0,
            }}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText addonType='prepend'>$</InputGroupText>
                <Input
                  id='min_amount'
                  invalid={errors.loan_data?.min_amount && true}
                  type='number'
                  placeholder='1000'
                  {...field}
                />
              </InputGroup>
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='max_amount'>
            Cantidad maxima <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='loan_data.max_amount'
            control={control}
            rules={{
              validate: value => !isNaN(value) && parseFloat(value) > 0,
            }}
            render={({ field }) => (
              <InputGroup>
                <InputGroupText addonType='prepend'>$</InputGroupText>
                <Input
                  className='form-control'
                  id='max_amount'
                  invalid={errors.loan_data?.max_amount && true}
                  placeholder='5,000'
                  type='number'
                  options={{
                    prefix: '$',
                    numeral: true,
                    numeralThousandsGroupStyle: 'thousand',
                  }}
                  {...field}
                />
              </InputGroup>
              // <Cleave className='form-control' placeholder='100,000' options={options} id='max_amount' invalid={errors.loan_data?.max_amount && true} {...field} />
            )}
          />
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='step'>
            Salto Entre Montos para Prestamo <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='loan_data.step'
            control={control}
            rules={{
              validate: value => !isNaN(value) && parseFloat(value) > 0,
            }}
            render={({ field }) => (
              <Input
                id='step'
                invalid={errors.loan_data?.step && true}
                placeholder='1000'
                type='number'
                {...field}
              />
            )}
          />
          {errors.name && <FormFeedback>Ingrese step de aumento</FormFeedback>}
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

export default SidebarCompanies
