// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Third Party Components
import axios from 'axios';

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap';

// ** Demo Components
import Tabs from './Tabs';
import Breadcrumbs from '@components/breadcrumbs';
import BillingTabContent from './BillingTabContent';
import AccountTabContent from './AccountTabContent';
import SecurityTabContent from './SecurityTabContent';

import avatar3 from '@src/assets/images/avatars/3-small.png';
import avatar11 from '@src/assets/images/portrait/small/avatar-s-11.jpg';

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss';
import '@styles/react/pages/page-account-settings.scss';

// ** Store & Actions
import { getUser } from '../../apps/user/store';
import { useDispatch, useSelector } from 'react-redux';

const AccountSettings = () => {
  // ** States
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('1');
  const store = useSelector(state => state.users);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [data, setData] = useState({
    general: {
      avatar: avatar11,
    },
    info: {
      bio: '',
      dob: null,
      country: 'USA',
      website: '',
      phone: 6562542568,
    },
    social: {
      socialLinks: {
        twitter: 'https://www.twitter.com',
        facebook: '',
        google: '',
        linkedIn: 'https://www.linkedin.com',
        instagram: '',
        quora: '',
      },
      connections: {
        twitter: {
          profileImg: avatar11,
          id: 'johndoe',
        },
        google: {
          profileImg: avatar3,
          id: 'luraweber',
        },
        facebook: {},
        github: {},
      },
    },
    notification: {
      commentOnArticle: true,
      answerOnForm: true,
      followMe: false,
      newAnnouncements: true,
      productUpdates: true,
      blogDigest: false,
    },
  });

  // ** Get data on mount
  useEffect(() => {
    const item = window.localStorage.getItem('userData');
    const userInfo = JSON.parse(item);
    setData({ ...data, general: { ...data.general, ...userInfo } });
    setLoadingUserData(false);
  }, []);

  const toggleTab = tab => {
    setActiveTab(tab);
  };

  return (
    <Fragment>
      <Breadcrumbs
        title='Account Settings'
        data={[{ title: 'Pages' }, { title: 'Account Settings' }]}
      />
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs
              className='mb-2'
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                {!loadingUserData && <AccountTabContent data={data.general} />}
              </TabPane>
              <TabPane tabId='2'>
                <SecurityTabContent />
              </TabPane>
              <TabPane tabId='3'>
                <BillingTabContent />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
};

export default AccountSettings;
