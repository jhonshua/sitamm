// ** User List Component
import Table from './Table'
// ** React Imports
import { useEffect, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'
// ** Store & Actions
import { getData } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UsersList = () => {
  const dispatch = useDispatch()
  const [userCount, setUserCount] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
  })
  const store = useSelector(state => state.users)

  useEffect(() => {
    const a = dispatch(getData({ limit: 50, perPage: 50 }))
    a.then(res => {
      const data = res.payload.data
      const total = data.length
      const pending = data.filter(users => users.data.status === 0).length
      const active = data.filter(users => users.data.status === 1).length
      const inactive = data.filter(users => users.data.status === 2).length
      setUserCount({ total, active, pending, inactive })
    })
  }, [dispatch])

  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total de Usuarios'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{userCount.total}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Usuarios Inactivos'
            icon={<UserPlus size={20} />}
            renderStats={
              <h3 className='fw-bolder mb-75'>{userCount.inactive}</h3>
            }
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Usuarios Activos'
            icon={<UserCheck size={20} />}
            renderStats={
              <h3 className='fw-bolder mb-75'>{userCount.active}</h3>
            }
          />
        </Col>
        {/* <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Usuarios Pendientes'
            icon={<UserX size={20} />}
            renderStats={
              <h3 className='fw-bolder mb-75'>{userCount.pending}</h3>
            }
          />
        </Col> */}
      </Row>
      <Table />
    </div>
  )
}

export default UsersList
