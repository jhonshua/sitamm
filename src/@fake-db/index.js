import mock from './mock'

import './jwt'
import './select'
import './apps/invoice'
import './apps/calendar'
import './apps/userList'
import './tables/datatables'
import './navbar/navbarSearch'
import './apps/permissionsList'
import './cards/card-analytics'
import './cards/card-statistics'
import './autoComplete/autoComplete'

mock.onAny().passThrough()
