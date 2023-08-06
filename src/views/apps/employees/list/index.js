// ** User List Component
import Table from './Table'
import { useSelector } from 'react-redux'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'


const EmployeesList = () => {

  const store = useSelector(state => state.employees)

  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total de Afiliados'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{store.total}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Afiliados Inactivos'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>0</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Afiliados Activos'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{store.total}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Afiliados Pendientes'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>0</h3>}
          />
        </Col>
      </Row>
      <Table />
    </div>
  )
}

export default EmployeesList
