import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import UserTableRow from './UserTableRow';

const UserTable = ({ users, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (users.length === 0) {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{t('user.name')}</th>
            <th>{t('user.surname')}</th>
            <th>{t('user.email')}</th>
            <th>{t('user.phone')}</th>
            <th>{t('user.status')}</th>
            <th>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" className="text-center py-4">
              {t('user.noData')}
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t('user.name')}</th>
          <th>{t('user.surname')}</th>
          <th>{t('user.email')}</th>
          <th>{t('user.phone')}</th>
          <th>{t('user.status')}</th>
          <th>{t('common.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserTableRow 
            key={user.guid} 
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable; 