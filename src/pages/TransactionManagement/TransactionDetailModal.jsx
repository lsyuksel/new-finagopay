import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const TransactionDetailModal = ({ 
  show, 
  onHide, 
  selectedRow, 
  isProvision, 
  t,
  formatters
}) => {
  if (!selectedRow) return null;
  
  const { getBankName, getCardTypeName, getTransactionTypeName } = formatters;
  
  const fields = isProvision ? [
    { key: 'insertDateTime', label: t('transaction.transactionDate') },
    { key: 'orderId', label: t('transaction.orderId') },
    { key: 'paymentId', label: t('transaction.paymentId') },
    { key: 'bankUniqueReferenceNumber', label: t('transaction.bankUniqueReferenceNumber') },
    { key: 'ravenTransactionTypeGuid', label: t('transaction.transactionType'), formatter: getTransactionTypeName },
    { key: 'cardNo', label: t('transaction.cardNo') },
    { key: 'cardTypeGuid', label: t('transaction.cardType'), formatter: getCardTypeName },
    { key: 'provisionStatusGuid', label: t('transaction.provisionStatus') },
    { key: 'preAuthAmount', label: t('transaction.preAuthAmount') },
    { key: 'f004', label: t('transaction.transactionAmount') },
    { key: 'f005', label: t('transaction.settlementAmount') },
    { key: 'bankGuid', label: t('transaction.bankName'), formatter: getBankName },
    { key: 'f038', label: t('transaction.authorizationNumber') },
    { key: 'f041', label: t('transaction.terminalId') },
  ] : [
    { key: 'insertDateTime', label: t('transaction.transactionDate') },
    { key: 'orderId', label: t('transaction.orderId') },
    { key: 'paymentId', label: t('transaction.paymentId') },
    { key: 'bankUniqueReferenceNumber', label: t('transaction.bankUniqueReferenceNumber') },
    { key: 'payOutStatusName', label: t('transaction.paymentStatus') },
    { key: 'ravenTransactionTypeGuid', label: t('transaction.transactionType'), formatter: getTransactionTypeName },
    { key: 'cardNo', label: t('transaction.cardNo') },
    { key: 'cardTypeGuid', label: t('transaction.cardType'), formatter: getCardTypeName },
    { key: 'provisionStatusGuid', label: t('transaction.provisionStatus') },
    { key: 'preAuthAmount', label: t('transaction.preAuthAmount') },
    { key: 'f004', label: t('transaction.transactionAmount') },
    { key: 'f005', label: t('transaction.settlementAmount') },
    { key: 'bankGuid', label: t('transaction.bankName'), formatter: getBankName },
    { key: 'f038', label: t('transaction.authorizationNumber') },
    { key: 'f041', label: t('transaction.terminalId') },
  ];

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isProvision ? t('transaction.provisionDetails') : t('transaction.provisionSettleDetails')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            {fields.map(field => (
              <Col md={6} key={field.key} className="mb-3">
                <Form.Group>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type="text"
                    value={field.formatter ? field.formatter(selectedRow[field.key]) : (selectedRow[field.key] || '')}
                    disabled
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionDetailModal; 