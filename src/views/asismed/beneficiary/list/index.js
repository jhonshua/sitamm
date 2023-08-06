/*eslint semi: ["error", "always"]*/
import Table from './Table';
import '@styles/react/apps/app-users.scss';

const Beneficiary = () => {
  return (
    <div className="app-user-list">
      <Table />
    </div>
  );
};

export default Beneficiary;