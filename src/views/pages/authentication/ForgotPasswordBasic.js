// ** React Imports
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { get_api_url, get_api_key } from '../../../utility/url'
// ** Icons Imports
import { ChevronLeft, Check } from 'react-feather'
import logo from "../../../assets/images/logo/logo-danger.png"
import Avatar from '@components/avatar'
import axios from 'axios'
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from 'reactstrap'
import { toast } from 'react-hot-toast'
// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ForgotPasswordBasic = () => {
  //state
  const sUrl = get_api_url()
  const key = get_api_key()

  const [email, setMail] = useState('')

  const handlerOnchage = e => {
    e.preventDefault()
    setMail(e.target.value)
  }

  // send date
  const postData = async e => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${sUrl}/recover-password`,
        { email }
      )
      toast(
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6>correo enviado!</h6>
          </div>
        </div>
      )
      setMail('')
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
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
              Has olvidado tu contraseña? 🔒
            </CardTitle>
            <CardText className='mb-2'>
              Ingrese su correo electrónico y le enviaremos instrucciones para
              restablecer su contraseña
            </CardText>
            <Form
              className='auth-forgot-password-form mt-2'
              onSubmit={e => postData(e)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input
                  type='email'
                  id='login-email'
                  placeholder='john@example.com'
                  value={email}
                  autoFocus
                  onChange={e => handlerOnchage(e)}
                />
              </div>
              <Button color='primary' block>
                Enviar enlace de reinicio
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

export default ForgotPasswordBasic
