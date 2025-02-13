import { useEffect, useState } from 'react';
import { Container, Button, Spinner, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setCurrentPage, setItemsPerPage, selectPaginatedUsers } from '../../store/slices/userSlice';
import UserTable from '../../components/User/UserTable';
import Pagination from '../../components/Common/Pagination';
import UserEditModal from '../../components/User/UserEditModal';

const UserDefinition = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error, initialized, pagination } = useSelector((state) => state.users);
  const paginatedUsers = useSelector(selectPaginatedUsers);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!initialized && !loading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, initialized, loading]);

  const handlePageChange = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const handleItemsPerPageChange = (e) => {
    dispatch(setItemsPerPage(Number(e.target.value)));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditSubmit = (updatedUser) => {
    // TODO: API'ye güncelleme isteği gönder
    console.log('Updated user:', updatedUser);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDelete = (user) => {
    // TODO: Silme işlemi
    console.log('Delete user:', user);
  };

  if (loading) {
    return (
      <Container className="py-3 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          {t('menu.userdefinition')}
        </h4>
        <Button variant="primary">
          <i className="fas fa-plus me-2"></i>
          {t('common.addNew')}
        </Button>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <Form.Select
          style={{ width: 'auto' }}
          value={pagination.itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value="5">5 {t('common.itemsPerPage')}</option>
          <option value="10">10 {t('common.itemsPerPage')}</option>
          <option value="25">25 {t('common.itemsPerPage')}</option>
          <option value="50">50 {t('common.itemsPerPage')}</option>
        </Form.Select>
      </div>

      <UserTable 
        users={paginatedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          {t('common.showing')} {pagination.itemsPerPage} / {pagination.totalItems} {t('common.items')}
        </div>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <UserEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={selectedUser}
        onSubmit={handleEditSubmit}
      />
    </Container>
  );
};

export default UserDefinition; 