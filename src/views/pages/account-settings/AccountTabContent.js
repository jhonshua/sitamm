// ** React Imports
import { Fragment, useState } from 'react';

// ** Third Party Components
import Select from 'react-select';
import Cleave from 'cleave.js/react';
import { useForm, Controller } from 'react-hook-form';
import 'cleave.js/dist/addons/cleave-phone.us';

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
} from 'reactstrap';

// ** Utils
import { selectThemeColors } from '@utils';

// ** Demo Components
import DeleteAccount from './DeleteAccount';

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'dutch', label: 'Dutch' },
];

const currencyOptions = [
  { value: 'usd', label: 'USD' },
  { value: 'euro', label: 'Euro' },
  { value: 'pound', label: 'Pound' },
  { value: 'bitcoin', label: 'Bitcoin' },
];

const timeZoneOptions = [
  {
    value: '(GMT-12:00) International Date Line West',
    label: '(GMT-12:00) International Date Line West',
  },
  {
    value: '(GMT-11:00) Midway Island, Samoa',
    label: '(GMT-11:00) Midway Island, Samoa',
  },
  { value: '(GMT-10:00) Hawaii', label: '(GMT-10:00) Hawaii' },
  { value: '(GMT-09:00) Alaska', label: '(GMT-09:00) Alaska' },
  {
    value: '(GMT-08:00) Pacific Time (US & Canada)',
    label: '(GMT-08:00) Pacific Time (US & Canada)',
  },
  {
    value: '(GMT-08:00) Tijuana, Baja California',
    label: '(GMT-08:00) Tijuana, Baja California',
  },
  { value: '(GMT-07:00) Arizona', label: '(GMT-07:00) Arizona' },
  {
    value: '(GMT-07:00) Chihuahua, La Paz, Mazatlan',
    label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan',
  },
  {
    value: '(GMT-07:00) Mountain Time (US & Canada)',
    label: '(GMT-07:00) Mountain Time (US & Canada)',
  },
  {
    value: '(GMT-06:00) Central America',
    label: '(GMT-06:00) Central America',
  },
  {
    value: '(GMT-06:00) Central Time (US & Canada)',
    label: '(GMT-06:00) Central Time (US & Canada)',
  },
  {
    value: '(GMT-06:00) Guadalajara, Mexico City, Monterrey',
    label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey',
  },
  { value: '(GMT-06:00) Saskatchewan', label: '(GMT-06:00) Saskatchewan' },
  {
    value: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco',
    label: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco',
  },
  {
    value: '(GMT-05:00) Eastern Time (US & Canada)',
    label: '(GMT-05:00) Eastern Time (US & Canada)',
  },
  { value: '(GMT-05:00) Indiana (East)', label: '(GMT-05:00) Indiana (East)' },
  {
    value: '(GMT-04:00) Atlantic Time (Canada)',
    label: '(GMT-04:00) Atlantic Time (Canada)',
  },
  {
    value: '(GMT-04:00) Caracas, La Paz',
    label: '(GMT-04:00) Caracas, La Paz',
  },
  { value: '(GMT-04:00) Manaus', label: '(GMT-04:00) Manaus' },
  { value: '(GMT-04:00) Santiago', label: '(GMT-04:00) Santiago' },
  { value: '(GMT-03:30) Newfoundland', label: '(GMT-03:30) Newfoundland' },
];

const AccountTabs = ({ data }) => {
  console.log('accountTabs data', data);
  // ** Hooks
  const defaultValues = {
    firstName: data.full_name.split(' ')[0],
    lastName: data.full_name.split(' ')[1],
  };
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** States
  const [avatar, setAvatar] = useState(data.avatar ? data.avatar : '');

  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      return null;
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
          });
        }
      }
    }
  };

  const handleImgReset = () => {
    setAvatar('@src/assets/images/avatars/avatar-blank.png');
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Detalles Perfil</CardTitle>
        </CardHeader>
        <CardBody className='py-2 my-25'>
          <div className='d-flex'>
            <div className='me-25'>
              <img
                className='rounded me-50'
                src={avatar}
                alt='Generic placeholder image'
                height='100'
                width='100'
              />
            </div>
            <div className='d-flex align-items-end mt-75 ms-1'>
              <div>
                <Button
                  tag={Label}
                  className='mb-75 me-75'
                  size='sm'
                  color='primary'
                >
                  Subir Foto
                  <Input
                    type='file'
                    onChange={onChange}
                    hidden
                    accept='image/*'
                  />
                </Button>
                <Button
                  className='mb-75'
                  color='secondary'
                  size='sm'
                  outline
                  onClick={handleImgReset}
                >
                  Reiniciar
                </Button>
                <p className='mb-0'>
                  Permitidos: JPG, GIF or PNG. Tamaño maximo 800kB
                </p>
              </div>
            </div>
          </div>
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='firstName'>
                  Nombre
                </Label>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='firstName'
                      placeholder='John'
                      invalid={errors.firstName && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.firstName && (
                  <FormFeedback>Please enter a valid First Name</FormFeedback>
                )}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='lastName'>
                  Apellido
                </Label>
                <Controller
                  name='lastName'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='lastName'
                      placeholder='Doe'
                      invalid={errors.lastName && true}
                      {...field}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormFeedback>Please enter a valid Last Name</FormFeedback>
                )}
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='emailInput'>
                  E-mail
                </Label>
                <Input
                  id='emailInput'
                  type='email'
                  name='email'
                  placeholder='Email'
                  defaultValue={data.email}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='company'>
                  Compañia
                </Label>
                <Input
                  defaultValue={data.company}
                  id='company'
                  name='company'
                  placeholder='Nombre de la compañia'
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='phone'>
                  Numero de telefono
                </Label>
                <Cleave
                  id='phone'
                  name='phone'
                  className='form-control'
                  placeholder='1 234 567 8900'
                  options={{ phone: true, phoneRegionCode: 'US' }}
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='address'>
                  Direccion
                </Label>
                <Input
                  id='address'
                  name='address'
                  placeholder='12, Business Park'
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='accountState'>
                  Estado
                </Label>
                <Input
                  id='accountState'
                  name='state'
                  placeholder='California'
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='zipCode'>
                  Codigo postal
                </Label>
                <Input
                  id='zipCode'
                  name='zipCode'
                  placeholder='123456'
                  maxLength='6'
                />
              </Col>
              <Col sm='6' className='mb-1'>
                <Label className='form-label' for='country'>
                  Pais
                </Label>
                <Select
                  id='country'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={countryOptions}
                  theme={selectThemeColors}
                  defaultValue={countryOptions.find(country => {
                    return country.value === data.country;
                  })}
                />
              </Col>
              <Col className='mt-2' sm='12'>
                <Button type='submit' className='me-1' color='primary'>
                  Guardar Cambios
                </Button>
                <Button color='secondary' outline>
                  Descartar
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
      <DeleteAccount />
    </Fragment>
  );
};

export default AccountTabs;
