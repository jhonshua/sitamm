// ** React Imports
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Coffee, X } from 'react-feather'


// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback
} from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg'
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg'
import logo from "../../../assets/images/logo/logo-danger.png"
// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ t, name }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X
            size={12}
            className='cursor-pointer'
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>Inicio de sesión correcto!</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: '',
  loginEmail: ''
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      useJwt
        .login({
          email: data.loginEmail,
          password: data.password,
          strategy: 'local'
        })
        .then(res => {
          const data = { ...res.data.user, accessToken: res.data.accessToken }
          dispatch(handleLogin(data))
          ability.update(res.data.user.ability)
          navigate(getHomeRouteForLoggedInUser(data.rol))
          toast(t => (
            <ToastContent
              t={t}
              role={data.rol || 'admin'}
              name={data.full_name || data.username || 'John Doe'}
            />
          ))
        })
        .catch(err => {
          setError('loginEmail', {
            type: 'manual',
            message: err?.response?.data?.message
          })
        })
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <img src={logo} height='28' alt="" />
          <h2 className='brand-text text-primary ms-1'>SITAMM</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col
          className='d-flex align-items-center auth-bg px-2 p-lg-5'
          lg='4'
          sm='12'
        >
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Bienvenido a SITAMM
            </CardTitle>
            <CardText className='mb-2'>
              Por favor ingrese sus credenciales
            </CardText>
            <Form
              className='auth-login-form mt-2'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='loginEmail'
                  name='loginEmail'
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type='email'
                      placeholder='john@example.com'
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Contraseña
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Olvidó su contraseña?</small>
                  </Link>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className='input-group-merge'
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Recuerdame
                </Label>
              </div>
              <Button type='submit' color='primary' block>
                Entrar
              </Button>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='me-25'>Eres nuevo?</span>
              <Link to='/register'>
                <span>Crear una cuenta</span>
              </Link>
            </p> */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
