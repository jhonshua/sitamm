import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Controller, useForm } from 'react-hook-form'
import logo from '../../../assets/images/logo/logo.png'
import Sidebar from '@components/sidebar'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-form-validation.scss'

// ** Third Party Components
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'

import { addLoan, setSidebar, updateLoan } from './store'
import { Button, Form, Input, Label, Spinner } from 'reactstrap'
import { toast } from 'react-hot-toast'

const defaultValues = {
  name: '',
  start_date: '',
  rates: '',
  amount: ''
}

const SidebarCompanies = () => {
  const [data, setData] = useState(null)
  const [apiErrors, setErrors] = useState(null)
  const store = useSelector(state => state.loans)

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
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  useEffect(() => {
    if (apiErrors) {
      for (const sKey in apiErrors) {
        setError(sKey, { type: 'manual', message: apiErrors[sKey] })
      }
    }
  }, [apiErrors])

  useEffect(() => {
    if (store.selectedLoan) {
      const { start_date, rates, amount, employee } = store.selectedLoan

      setValue("name", employee.name)
      setValue("start_date", start_date)
      setValue("rates", rates)
      setValue("amount", amount)
    }
  }, [store?.selectedLoan])

  const toggleSidebar = () => {
    dispatch(setSidebar(!store.sidebar))
  }

  const onSubmit = data => {
    const oSend = { ...data }
    setData(data)

    if (store?.selectedLoan?._id) {
      dispatch(updateLoan({ id: store.selectedLoan._id, company: data }))
    } else {
      dispatch(addLoan(data))
    }
  };

  const handleSidebarClosed = () => {
    for (const sKey in defaultValues) {
      setValue(sKey, '')
    }
  }

  return (
    <Sidebar
      size="lg"
      open={store?.sidebar || false}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    ><div className='mb-1'><h2><img
      src={logo}
      height='30'
      width='30'
    />
      Editar Prestamo</h2> </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="name" >
            Nombre</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                id="name"
                invalid={errors.name && true}
                {...field}
                disabled
              />
            )
            }
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="start_date">
            Fecha
          </Label>
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <Flatpickr
                {...field}
                options={{ allowInput: true }}
                invalid={errors.start_date && true}
                className={classnames('form-control', {
                  'is-invalid': data !== null && data.start_date === null
                })}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="rates">
            Tasa
          </Label>
          <Controller
            name="rates"
            control={control}
            render={({ field }) => (
              <Input
                id="rates"
                invalid={errors.rates && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="amount">
            Monto
          </Label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                id="amount"
                invalid={errors.amount && true}
                {...field}
              />
            )}
          />
        </div>
        <Button disabled={store.loading} type="submit"
          className="me-1" color="primary">
          {store.loading ? <Spinner color="light" /> : 'Guardar'
          }
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancelar
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarCompanies