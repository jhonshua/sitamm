// ** React Imports
import { Link } from 'react-router-dom'
import { get_api_url, get_api_key } from '../../../utility/url'
import axios from 'axios'
// ** Icons Imports
import { ChevronLeft, Check } from 'react-feather'
import Avatar from '@components/avatar'
// ** Custom Components
import InputPassword from '@components/input-password-toggle'

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
  FormFeedback,
} from 'reactstrap'

import { Controller, useForm } from 'react-hook-form'

import logo from '@src/assets/images/logo/sitamm-logo.png'
// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { toast } from 'react-hot-toast'

const ResetPasswordBasic = () => {
  const sUrl = get_api_url()
  const key = get_api_key()
  const query = new URLSearchParams(window.location.search)

  const defaultValues = {
    password: '',
    rpassword: '',
  }

  const {
    control,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues })

  // send date
  const postData = async data => {
    console.log(data)
    const password = watch('password')
    const rpassword = watch('rpassword')

    if (password !== rpassword) {
      setError('rpassword', {
        type: 'manual',
        message: 'Las contraseñas no coinciden',
      })
    }
    if (Object.values(data).every(field => field.length > 0)) {
      try {
        const myQueryValor = query.get('q')

        const response = await axios.patch(
          `${sUrl}/forgot/${myQueryValor}`,
          data,
          {
            headers: {
              'x-api-key': key,
            },
          }
        )
        toast(
          <div className='d-flex'>
            <div className='me-1'>
              <Avatar size='sm' color='success' icon={<Check size={12} />} />
            </div>
            <div className='d-flex flex-column'>
              <h6>contraseña restablecida!</h6>
            </div>
          </div>
        )
        setNewPassword({
          password: '',
          rpassword: '',
        })
        return response.data
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.errors.password) {
          setError('password', {
            type: 'manual',
            message: 'La contraseña no tiene el formato requerido',
          })
          return toast.error(
            'La contraseña debe tener mínimo 5 caracteres y máximo 30, contener letras y/o números, y los caracteres especiales válidos son !@#$%='
          )
        }

        if (error.response.data && !error.response.data.errors.password) {
          return toast.error(error.response.data.message)
        }
      }
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-basic px-2'>
      <div className='auth-inner my-2'>
        <Card className='mb-0'>
          <CardBody>
            <Link className='brand-logo' to='/'>
              <img src={logo} alt='logo' width={100} />
            </Link>
            <CardTitle tag='h4' className='mb-1'>
              Restablecer la contraseña! 🔒
            </CardTitle>
            <CardText className='mb-2'>
              Su nueva contraseña debe ser diferente de las contraseñas
              utilizadas anteriormente
            </CardText>
            <Form
              className='auth-reset-password-form mt-2'
              onSubmit={handleSubmit(postData)}>
              <div className='mb-1'>
                <Label className='form-label' for='password'>
                  Nueva contraseña
                </Label>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPassword
                      className='input-group-merge'
                      id='password'
                      autoFocus
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors?.password?.message && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='rpassword'>
                  Confirmar Contraseña
                </Label>
                <Controller
                  name='rpassword'
                  control={control}
                  render={({ field }) => (
                    <InputPassword
                      className='input-group-merge'
                      id='rpassword'
                      invalid={errors.rpassword && true}
                      {...field}
                    />
                  )}
                />
                {errors?.rpassword?.message && (
                  <FormFeedback>{errors.rpassword.message}</FormFeedback>
                )}
              </div>
              <Button color='primary' block>
                Establecer nueva contraseña
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <Link to='/'>
                <ChevronLeft className='rotate-rtl me-25' size={14} />
                <span className='align-middle'>Volver a iniciar sesión</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ResetPasswordBasic
