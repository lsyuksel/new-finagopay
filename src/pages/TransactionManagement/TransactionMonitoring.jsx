import { useEffect, useState } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Nav, Tab, Alert, Spinner, Table, Card, Pagination, Dropdown, Form } from 'react-bootstrap';
import SearchProvision from './SearchProvision';
import SearchProvisionSettle from './SearchProvisionSettle';
import TransactionDetailModal from './TransactionDetailModal';
import {
  getBanks,
  getCardTypes,
  getCurrencies,
  getPaymentStatuses,
  getTransactionProvisions,
  getTransactionProvisionSettles,
  getTransactionTypes
} from '../../store/slices/transactionSlice';

const TransactionMonitoring = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('provisions');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('insertDateTime');
  const [sortDirection, setSortDirection] = useState('desc');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const [selectedRows, setSelectedRows] = useState({
    provisions: {},
    provisionSettles: {}
  });
  
  const { 
    loading, 
    error, 
    transactionProvisions, 
    transactionProvisionSettles,
    banks,
    cardTypes,
    transactionTypes,
  } = useSelector(state => state.transaction);

  const handleOpenModal = (rowData) => {
    setSelectedRow(rowData);
    setShowDetailModal(true);
  };
  
  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

  const getBankName = (bankGuid) => {
    if (!bankGuid) return '-';
    const bank = banks.find(b => b.guid === bankGuid);
    return bank ? (bank.bankName || bank.name) : bankGuid;
  };

  const getCardTypeName = (cardTypeGuid) => {
    if (!cardTypeGuid) return '-';
    const cardType = cardTypes.find(ct => ct.guid === cardTypeGuid);
    return cardType ? (cardType.description || cardType.name) : cardTypeGuid;
  };

  const getTransactionTypeName = (transactionTypeGuid) => {
    if (!transactionTypeGuid) return '-';
    const transactionType = transactionTypes.find(tt => tt.guid === transactionTypeGuid);
    return transactionType ? (transactionType.description || transactionType.name) : transactionTypeGuid;
  };

  const formatters = {
    getBankName,
    getCardTypeName,
    getTransactionTypeName
  };

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    
    dispatch(getBanks({ userName }));
    dispatch(getCardTypes());
    dispatch(getTransactionTypes());
    dispatch(getCurrencies());
    dispatch(getPaymentStatuses());
    
    const searchParams = {
      transactionStartDate: (() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 12);
        return date.toISOString().split('T')[0];
      })(),
      transactionEndDate: new Date().toISOString().split('T')[0],
      userName,
    }
    
    dispatch(getTransactionProvisions( searchParams ));
    dispatch(getTransactionProvisionSettles( searchParams ));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortData = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;
      
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className="btn btn-sm btn-link text-dark p-0"
    >
      {children}
    </button>
  ));

  const ActionMenu = ({ item }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id={`dropdown-${item.orderId || item.guid}`}>
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleOpenModal(item)}>
          {t('common.details')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const handleCheckboxChange = (id, type) => {
    setSelectedRows(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id]
      }
    }));
  };

  const handleSelectAll = (checked, data, type) => {
    const newSelected = { ...selectedRows };
    
    if (checked) {
      data.forEach(item => {
        const id = item.guid || item.orderId;
        newSelected[type][id] = true;
      });
    } else {
      newSelected[type] = {};
    }
    
    setSelectedRows(newSelected);
  };

  const isAllSelected = (data, type) => {
    if (data.length === 0) return false;
    
    return data.every(item => {
      const id = item.guid || item.orderId;
      return selectedRows[type][id];
    });
  };

  const renderTable = (data, type) => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <Alert variant="info">
          {t('common.noDataFound')}
        </Alert>
      );
    }

    const checkboxColumn = { 
      key: 'checkbox', 
      label: (
        <Form.Check
          type="checkbox"
          checked={isAllSelected(data, type)}
          onChange={(e) => handleSelectAll(e.target.checked, data, type)}
          label=""
        />
      )
    };
    
    const actionColumn = { key: 'actions', label: t('common.actions') };
    
    const columns = type === 'provisions' ? [
      checkboxColumn, 
      actionColumn,   
      { key: 'insertDateTime', label: t('transaction.transactionDate') },
      { key: 'orderId', label: t('transaction.orderId') },
      { key: 'paymentId', label: t('transaction.paymentId') },
      { key: 'bankUniqueReferenceNumber', label: t('transaction.bankUniqueReferenceNumber') },
      { key: 'transactionNetworkGuid', label: t('transaction.transactionNetwork') },
      { key: 'ravenAuthorizationResponseCodeGuid', label: t('transaction.responseCode') },
      { key: 'ravenTransactionTypeGuid', label: t('transaction.transactionType'), formatter: getTransactionTypeName },
      { key: 'cardNo', label: t('transaction.cardNo') },
      { key: 'cardTypeGuid', label: t('transaction.cardType'), formatter: getCardTypeName },
      { key: 'provisionStatusGuid', label: t('transaction.provisionStatus') },
      { key: 'preAuthAmount', label: t('transaction.preAuthAmount') },
      { key: 'f004', label: t('transaction.transactionAmount') },
      { key: 'f005', label: t('transaction.settlementAmount') },
      { key: 'f013', label: t('transaction.transactionDate') },
      { key: 'bankGuid', label: t('transaction.bankName'), formatter: getBankName },
      { key: 'f038', label: t('transaction.authorizationNumber') },
      { key: 'f041', label: t('transaction.terminalId') },
    ] : [
      checkboxColumn, 
      actionColumn,   
      { key: 'insertDateTime', label: t('transaction.transactionDate') },
      { key: 'orderId', label: t('transaction.orderId') },
      { key: 'paymentId', label: t('transaction.paymentId') },
      { key: 'bankUniqueReferenceNumber', label: t('transaction.bankUniqueReferenceNumber') },
      { key: 'payOutStatusName', label: t('transaction.paymentStatus') },
      { key: 'ravenAuthorizationResponseCodeGuid', label: t('transaction.responseCode') },
      { key: 'transactionNetworkGuid', label: t('transaction.transactionNetwork') },
      { key: 'ravenTransactionTypeGuid', label: t('transaction.transactionType'), formatter: getTransactionTypeName },
      { key: 'cardNo', label: t('transaction.cardNo') },
      { key: 'cardTypeGuid', label: t('transaction.cardType'), formatter: getCardTypeName },
      { key: 'provisionStatusGuid', label: t('transaction.provisionStatus') },
      { key: 'preAuthAmount', label: t('transaction.preAuthAmount') },
      { key: 'f004', label: t('transaction.transactionAmount') },
      { key: 'f005', label: t('transaction.settlementAmount') },
      { key: 'f013', label: t('transaction.transactionDate') },
      { key: 'bankGuid', label: t('transaction.bankName'), formatter: getBankName },
      { key: 'f038', label: t('transaction.authorizationNumber') },
      { key: 'f041', label: t('transaction.terminalId') },
    ];

    const sortedData = sortData(data);
    
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = sortedData.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginationItems = [];

    for (let number = 1; number <= totalPages; number++) {
      if (
        number === 1 || 
        number === totalPages || 
        (number >= currentPage - 2 && number <= currentPage + 2)
      ) {
        paginationItems.push(
          <Pagination.Item 
            key={number} 
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      } else if (
        (number === currentPage - 3 && currentPage > 3) || 
        (number === currentPage + 3 && currentPage < totalPages - 2)
      ) {
        paginationItems.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
      }
    }

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="me-2">{t('common.itemsPerPage')}:</span>
            <select 
              className="form-select form-select-sm d-inline-block w-auto"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div>
            <span className="me-2">
              {t('common.showing')} {firstIndex + 1} - {Math.min(lastIndex, data.length)} {t('common.of')} {data.length} {t('common.entries')}
            </span>
          </div>
        </div>
        
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th 
                    key={col.key}
                    onClick={col.key !== 'actions' && col.key !== 'checkbox' ? () => handleSort(col.key) : undefined}
                    style={{ 
                      cursor: col.key !== 'actions' && col.key !== 'checkbox' ? 'pointer' : 'default', 
                      minWidth: col.key === 'actions' ? '80px' : col.key === 'checkbox' ? '50px' : '200px',
                      width: col.key === 'actions' ? '80px' : col.key === 'checkbox' ? '50px' : 'auto'
                    }}
                    className="position-relative"
                  >
                    {col.label}
                    {sortField === col.key && col.key !== 'actions' && col.key !== 'checkbox' && (
                      <span className="ms-2">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  {columns.map((col) => {
                    if (col.key === 'checkbox') {
                      const id = item.guid || item.orderId;
                      return (
                        <td key={`${index}-${col.key}`} className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={!!selectedRows[type][id]}
                            onChange={() => handleCheckboxChange(id, type)}
                            label=""
                          />
                        </td>
                      );
                    } else if (col.key === 'actions') {
                      return (
                        <td key={`${index}-${col.key}`} className="text-center">
                          <ActionMenu item={item} />
                        </td>
                      );
                    }
                    return (
                      <td key={`${index}-${col.key}`}>
                        {col.formatter ? col.formatter(item[col.key]) : item[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            
            {paginationItems}
            
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
      </div>
    );
  };

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.transactionmonitoring')}
      </h4>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="provisions">{t('transaction.provisions')}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="provisionSettles">{t('transaction.provisionSettles')}</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="provisions">
            <SearchProvision />
            <Card>
              <Card.Body>
                {renderTable(transactionProvisions, 'provisions')}
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="provisionSettles">
            <SearchProvisionSettle />
            <Card>
              <Card.Body>
                {renderTable(transactionProvisionSettles, 'provisionSettles')}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      <TransactionDetailModal
        show={showDetailModal}
        onHide={handleCloseModal}
        selectedRow={selectedRow}
        isProvision={activeTab === 'provisions'}
        t={t}
        formatters={formatters}
      />
    </Container>
  );
};

export default TransactionMonitoring; 