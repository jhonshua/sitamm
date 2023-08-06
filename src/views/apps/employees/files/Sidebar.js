// ** React Import
import { useEffect, useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Third Party Components
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  Spinner,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { setSidebar, setFile } from '../store'

// ** Third Party Imports
import { X, DownloadCloud } from 'react-feather'

const defaultValues = {
  file_type: 'Seleccione archivo',
}

// ** Function to toggle sidebar
const toggleSidebar = () => {
  dispatch(setSidebar(!store.sidebar))
}

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

const ineOCR = async (file, lado_ine, toggle) => {
  const base64 = await toBase64(file)
  const route =
    lado_ine === 'ine_front' ? 'ocrineifefrente' : 'ocrineifereverso'
  const data_name =
    lado_ine === 'ine_front'
      ? 'base64_credencial_frente'
      : 'base64_credencial_reverso'

  const response = await fetch(`https://auth.hybrido.studio/api/${route}/`, {
    method: 'POST',
    body: JSON.stringify({ [data_name]: base64 }),
    headers: {
      Authorization: 'Api-Key IS66XECE.uvVhvzbtl9DG3uEhTBeBk1OrGEWXUVAn',
      'Content-Type': 'application/json',
    },
  })

  const res = await response.json()
  if (res.status !== 'SUCCESFUL') {
    toast.error('Hubo un problema al procesar la imagen')
    return
  }

  console.log('res figuras', res.response.data.figuras)
  Object.keys(res.response.data.figuras).forEach(key => {
    if (!res.response.data.figuras[key]) {
      toast.error(
        'Hubo un problema al procesar la imagen, no se econtro el siguente elemento: ' +
          key
      )
      return
    }
  })

  toast.success('Imagen procesada correctamente')
  toggle()
  return true
}

const SidebarNewUsers = () => {
  // ** States
  const [files, setFiles] = useState([])
  const [apiErrors, setErrors] = useState(null)
  const [fileType, setFileType] = useState('Seleccionar archivo')
  const store = useSelector(state => state.employees)

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
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (store.selectedEmployee) {
      let oData = { ...store.selectedEmployee }
      for (const sKey in defaultValues) {
        setValue(sKey, oData[sKey])
      }
    }
  }, [store?.selectedEmployee])

  const toggleSidebar = () => {
    dispatch(setSidebar(!store.sidebar))
  }

  // ** Function to handle form submit
  const onSubmit = data => {
    if (fileType === 'Seleccionar archivo') {
      toast.error('Selecciona el tipo de archivo')
      return
    }

    if (files.length === 0) {
      toast.error('Selecciona un archivo')
      return
    }

    if (fileType === 'address') {
      // TODO: Upload file to DB
    }

    if (ineOCR(files[0], fileType, toggleSidebar)) {
      // TODO: Upload file to DB
      dispatch(setFile(data))
    }
  }

  const handleSidebarClosed = () => {
    console.log('Sidebar Closed')
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error('You can only upload image Files!.')
      } else {
        setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      }
    },
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return (
        <img
          className='rounded'
          alt={file.name}
          src={URL.createObjectURL(file)}
          height='28'
          width='28'
        />
      )
    } else {
      return <FileText size='28' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color='danger'
        outline
        size='sm'
        className='btn-icon'
        onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Sidebar
      size='lg'
      open={store?.sidebar || false}
      title={`${store.selectedUser ? 'Modificar' : 'Nuevo'} afiliado`}
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label className='form-label' for='select-plan'>
          Seleccionar Empresa
        </Label>
        <div
          className='mb-1'
          value={fileType}
          onChange={e => setFileType(e.target.value)}>
          <Input type='select' id='file_type' name='file_type'>
            <option value=''>Seleccionar archivo</option>
            <option key='ine_front' value='ine_front'>
              INE frente
            </option>
            <option key='ine_back' value='ine_back'>
              INE reverso
            </option>
            <option key='address' value='address'>
              Comprobante domicilio
            </option>
          </Input>
        </div>
        <Card>
          <CardHeader>
            <CardTitle tag='h4'>Archivo</CardTitle>
          </CardHeader>
          <CardBody>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='d-flex align-items-center justify-content-center flex-column'>
                <DownloadCloud size={64} />
                <h5>Haz click aqui o arrastra un archivo</h5>
                <p className='text-secondary'>
                  Arrastra un archivo aqui o haz{' '}
                  <a href='/' onClick={e => e.preventDefault()}>
                    click aqui
                  </a>{' '}
                  para seleccionar un archivo de tu PC
                </p>
              </div>
            </div>
            {files.length ? (
              <>
                <ListGroup className='my-2'>{fileList}</ListGroup>
                <div className='d-flex justify-content-end'>
                  <Button
                    className='me-1'
                    color='danger'
                    outline
                    onClick={handleRemoveAllFiles}>
                    Quitar archivo
                  </Button>
                </div>
              </>
            ) : null}
          </CardBody>
        </Card>
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
