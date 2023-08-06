// ** Navigation imports
import apps from './apps'
import pages from './pages'
import forms from './forms'
import tables from './tables'
import others from './others'
import charts from './charts'
import dashboards from './dashboards'
import uiElements from './ui-elements'

// ** Merge & Export
let navigation_config = []
if (import.meta.env.VITE_DEVELOPMENT_MODE === 'true') {
  navigation_config = [
    ...dashboards,
    ...apps,
    ...pages,
    ...uiElements,
    ...forms,
    ...tables,
    ...charts,
    ...others,
  ]
} else {
  navigation_config = [...apps]
}

export default navigation_config
