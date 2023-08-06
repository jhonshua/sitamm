// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import users from '@src/views/apps/user/store'
import invoice from '@src/views/apps/invoice/store'
import calendar from '@src/views/apps/calendar/store'
import dataTables from '@src/views/tables/data-tables/store'
import permissions from '@src/views/apps/roles-permissions/store'
import companies from '@src/views/apps/companies/store'
import employees from '@src/views/apps/employees/store'
import loans from '@src/views/apps/loans/store'
import payments from '@src/views/apps/payments/store'
import plans from '@src/views/apps/plans/store'
import beneficiary from '@src/views/asismed/beneficiary/store'
import benefit from '@src/views/beneficios/list/store'
import benefitCategory from '@src/views/beneficios/category/store'
const rootReducer = {
  auth,
  users,
  navbar,
  layout,
  invoice,
  calendar,
  dataTables,
  permissions,
  companies,
  employees,
  loans,
  payments,
  plans,
  beneficiary,
  benefit,
  benefitCategory,
}

export default rootReducer
