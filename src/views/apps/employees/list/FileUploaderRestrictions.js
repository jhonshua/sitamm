// ** React Imports
import { useState, Fragment, useEffect } from 'react'
import { setFile, deleteFile } from '../store'
import { useDispatch } from 'react-redux'
// ** Reactstrap Imports
import { Card, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { DownloadCloud } from 'react-feather'


const FileUploaderRestrictions = ({
  id,
  name,
  pdf,
  typeFile,
  nameFile
}) => {
  // ** State
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      ...(pdf && { 'application/pdf': ['.pdf'] })
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error('¡Solo puede cargar archivos de imagen!.')
      } else if (files.length + acceptedFiles.length > 1) toast.error(`Puede cargar un máximo de 1 archivo en el campo ${name}.`)
      else {
        setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
      }
    }
  });



  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }
  useEffect(() => {
    if (files.length > 0) {
      const newFile = {
        files: files[0],
        nameFile,
        typeFile,
        id,
        name
      };
      dispatch(setFile(newFile));
    }
  }, [files])


  const handleRemoveAllFiles = () => {
    setFiles([])
    if (id && nameFile && typeFile) {
      const data = {
        id,
        nameFile,
        typeFile
      }
      dispatch(deleteFile(data))
    }
  }

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className='d-flex align-items-center justify-content-between'
    >
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>
          <img
            className='rounded'
            alt={file.name}
            src={URL.createObjectURL(file)}
            height='50'
            width='60'
          />
        </div>
        <div>
          <p className='file-size m-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
    </ListGroupItem>
  ))

  return (
    <Card>
      <CardBody>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <DownloadCloud size={64} />
            <h5 className='text-center'>
              Suelte los archivos aqui o click en{' '}
              <span className='text-secondary'>
                <a href='/' onClick={e => e.preventDefault()}>
                  buscar.
                </a>{' '}
              </span>
              para cargar
            </h5>
          </div>
        </div>
        {files.length ? (
          <Fragment>
            <ListGroup className='my-2'>{fileList}</ListGroup>
            <div className='d-flex justify-content-center'>
              <Button
                className='me-1'
                color='danger'
                outline
                onClick={handleRemoveAllFiles}
              >
                Remover
              </Button>
            </div>
          </Fragment>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default FileUploaderRestrictions
