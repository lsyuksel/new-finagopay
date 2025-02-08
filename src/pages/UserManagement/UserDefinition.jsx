import { useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Pagination, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setCurrentPage, setItemsPerPage, selectPaginatedUsers } from '../../store/slices/userSlice';

const UserDefinition = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error, initialized, pagination } = useSelector((state) => state.users);
  const paginatedUsers = useSelector(selectPaginatedUsers);

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

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    let items = [];

    // İlk sayfa
    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
    );

    // Önceki sayfa
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    // Sayfa numaraları
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Sonraki sayfa
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    // Son sayfa
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    );

    return <Pagination>{items}</Pagination>;
  };

  const renderUserStatus = (isActive) => (
    <Badge bg={isActive ? 'success' : 'danger'}>
      {isActive ? t('common.active') : t('common.passive')}
    </Badge>
  );

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
          {paginatedUsers.map((user) => (
            <tr key={user.guid}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{renderUserStatus(user.isActive)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <i className="fas fa-edit"></i>
                </Button>
                <Button variant="outline-danger" size="sm">
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                {t('user.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          {t('common.showing')} {pagination.itemsPerPage} / {pagination.totalItems} {t('common.items')}
        </div>
        {renderPagination()}
      </div>
    </Container>
  );
};

export default UserDefinition; 