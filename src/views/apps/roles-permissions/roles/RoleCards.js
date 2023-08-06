// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Table,
  Modal,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  FormFeedback,
  UncontrolledTooltip,
} from 'reactstrap'

// ** Third Party Components
import { Copy, Info } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getData, setRol, updateRol, addRole } from '../store'

// ** FAQ Illustrations
import illustration from '@src/assets/images/illustration/faq-illustrations.svg'

const rolesArr = [
  'Gestión de usuarios',
  'Gestión de contenido',
  'Gestión de Conflictos',
  'Gestión de base de datos',
  'Gestión financiera',
  'Reportes',
  'Control API',
  'Administración de repositorios',
  'Nómina de sueldos',
]

const RoleCards = () => {
  const dispatch = useDispatch()
  const store = useSelector((state) => state.permissions)

  // ** States
  const [show, setShow] = useState(false)
  const [modalType, setModalType] = useState('Add New')
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState('id')
  const [oData, setData] = useState({})

  useEffect(() => {
    dispatch(
      getData({
        sort,
        role: '',
        sortColumn,
        status: '',
        q: searchTerm,
        currentPlan: '',
        page: currentPage,
        perPage: rowsPerPage,
      }),
    )
  }, [dispatch, store.data.length])

  // ** Hooks
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { group: '', home: '/', name: '' } })

  const onSubmit = (data) => {
    const oSend = { ...oData, status: 1 }
    if (store?.selected?._id) {
      dispatch(
        updateRol({
          id: store.selected._id,
          role: {
            ...oSend,
          },
        }),
      )
      setShow(false)
      dispatch(setRol(null))
      setData({})

    } else {
      dispatch(
        addRole({
          ...oSend
        }),
      )
      setData({})
      setShow(false)


    }


  }

  const onReset = () => {
    setShow(false)
    reset({ roleName: '' })
    setData({})
    dispatch(setRol(null))


  }

  const handleModalClosed = () => {
    setModalType('Add New')
    setValue('roleName')
    setData({})
    dispatch(setRol(null))

  }

  return (
    <Fragment>
      <Row>
        {store?.data.map((item, index) => {
          return (
            <Col key={index} xl={4} md={6}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between">
                    <span>{`${item.users?.length} usuarios`}</span>
                    {/* <AvatarGroup data={item.users.map(oUser => ({
                      size: 'sm',
                      title: oUser.full_name || oUser.username,
                      img: oUser.photo || getRandomAvatar(),
                    }))} /> */}
                  </div>
                  <div className="d-flex justify-content-between align-items-end mt-1 pt-25">
                    <div className="role-heading">
                      <h4 className="fw-bolder">{item.name}</h4>
                      <Link
                        to="/"
                        className="role-edit-modal"
                        onClick={(e) => {
                          e.preventDefault()
                          setData({
                            name: item.name,
                            group: item.group,
                            home: item.home,
                          })
                          setModalType('Edit')
                          setShow(true)

                          dispatch(setRol(item))

                          setValue({
                            name: item.name,
                            group: item.group,
                            home: item.home,
                          })

                      
                        }}
                      >
                        <small className="fw-bolder">Editar Rol</small>
                      </Link>
                    </div>
                    <Link
                      to=""
                      className="text-body"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Copy className="font-medium-5" />
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
        <Col xl={4} md={6}>
          <Card>
            <Row>
              <Col sm={5}>
                <div className="d-flex align-items-end justify-content-center h-100">
                  <img
                    className="img-fluid mt-2"
                    src={illustration}
                    alt="Image"
                    width={85}
                  />
                </div>
              </Col>
              <Col sm={7}>
                <CardBody className="text-sm-end text-center ps-sm-0">
                  <Button
                    color="primary"
                    className="text-nowrap mb-1"
                    onClick={() => {
                      setModalType('Agregar nuevo')
                      setShow(true)
                    }}
                  >
                    Agregar rol
                  </Button>
                  <p className="mb-0">Agregar un nuevo rol con privilegios</p>
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>{modalType} Rol</h1>
            <p>Asignar privilegios</p>
          </div>
          <Row tag="form" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <Label className="form-label" for="name">
                Nombre de Rol
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => {
             
                  return (
                    <Input
                      id="name"
                      placeholder="Nombre del Rol"
                      invalid={errors.name && true}
                      {...field}
                      value = {oData.name ? oData.name :'' }
                      onChange= {(value)=>{
                        setData({...oData,
                      name: value.currentTarget.value})}}
                    />
                  )
                }}
              />
              {errors.roleName && (
                <FormFeedback>Ingrese un nombre válido</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="roleName">
                Grupo
              </Label>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <Input
                    id="group"
                    placeholder=""
                    invalid={errors.full_name && true}
                    value = {oData.group ? oData.group :'' }
                    onChange= {(value)=>{
                      setData({...oData,
                    group: value.currentTarget.value})}

                    }
                  />
                )}
              />
              {errors.roleName && (
                <FormFeedback>Ingrese un nombre de grupo valido</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="roleName">
                Home
              </Label>
              <Controller
                name="home"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="roleName"
                    placeholder="/"
                    invalid={errors.home && true}
                    value = {oData.home ? oData.home :'' }
                    onChange= {(value)=>{
                      setData({...oData,
                    home: value.currentTarget.value})}}
                    

                  />
                )}
              />
              {errors.roleName && (
                <FormFeedback>Ingrese una ruta inicial valida</FormFeedback>
              )}
            </Col>
            <Col xs={12}>
              <h4 className="mt-2 pt-50">Permisos del Rol</h4>
              <Table className="table-flush-spacing" responsive>
                <tbody>
                  <tr>
                    <td className="text-nowrap fw-bolder">
                      <span className="me-50"> Administrador</span>
                      <Info size={14} id="info-tooltip" />
                      <UncontrolledTooltip
                        placement="top"
                        target="info-tooltip"
                      >
                        Permite un acceso completo al sistema.
                      </UncontrolledTooltip>
                    </td>
                    <td>
                      <div className="form-check">
                        <Input type="checkbox" id="select-all" />
                        <Label className="form-check-label" for="select-all">
                          Seleccionar Todos
                        </Label>
                      </div>
                    </td>
                  </tr>
                  {rolesArr.map((role, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-nowrap fw-bolder">{role}</td>
                        <td>
                          <div className="d-flex">
                            <div className="form-check me-3 me-lg-5">
                              <Input type="checkbox" id={`read-${role}`} />
                              <Label
                                className="form-check-label"
                                for={`read-${role}`}
                              >
                                Leer
                              </Label>
                            </div>
                            <div className="form-check me-3 me-lg-5">
                              <Input type="checkbox" id={`write-${role}`} />
                              <Label
                                className="form-check-label"
                                for={`write-${role}`}
                              >
                                Escribir
                              </Label>
                            </div>
                            <div className="form-check">
                              <Input type="checkbox" id={`create-${role}`} />
                              <Label
                                className="form-check-label"
                                for={`create-${role}`}
                              >
                                Crear
                              </Label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Col>
            <Col className="text-center mt-2" xs={12}>
              <Button type="submit" color="primary" className="me-1">
                Guardar
              </Button>
              <Button type="reset" outline onClick={onReset}>
                Cancelar
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default RoleCards
