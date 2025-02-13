import { Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const UserTableRow = ({ user, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const renderUserStatus = (isActive) => (
    <Badge bg={isActive ? 'success' : 'danger'}>
      {isActive ? t('common.active') : t('common.passive')}
    </Badge>
  );

  return (
    <tr>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>{renderUserStatus(user.status)}</td>
      <td>
        <Button 
          variant="outline-primary" 
          size="sm" 
          className="me-2"
          onClick={() => onEdit(user)}
        >
          <i className="fas fa-edit"></i>
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={() => onDelete(user)}
        >
          <i className="fas fa-trash"></i>
        </Button>
      </td>
    </tr>
  );
};

export default UserTableRow; 