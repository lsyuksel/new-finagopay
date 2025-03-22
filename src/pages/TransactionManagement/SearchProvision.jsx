import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SelectField from '../../components/Common/SelectField';
import { getTransactionProvisions } from '../../store/slices/transactionSlice';

const SearchProvision = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { 
    banks, 
    currencies, 
    transactionTypes, 
    loading 
  } = useSelector(state => state.transaction);
  
  const [bankOption, setBankOption] = useState(null);
  const [currencyOption, setCurrencyOption] = useState(null);
  const [transactionTypeOption, setTransactionTypeOption] = useState(null);

  const validationSchema = Yup.object().shape({
    orderId: Yup.string()
      .max(40, t('errors.maxLengthError', { length: 40 }))
      .nullable(),
    authorizationNumber: Yup.string()
      .max(6, t('errors.maxLengthError', { length: 6 }))
      .nullable(),
    transactionAmountLow: Yup.number()
      .nullable()
      .typeError(t('errors.mustBeNumber')),
    transactionAmountHigh: Yup.number()
      .nullable()
      .typeError(t('errors.mustBeNumber')),
  });

  const initialValues = {
    bankGuid: null,
    currencyGuid: null,

    transactionStartDate: (() => {
      
      const date = new Date();
      date.setMonth(date.getMonth() - 12);
      return date.toISOString().split('T')[0]; 
    })(),
    transactionEndDate: new Date().toISOString().split('T')[0], 
    
    ravenTransactionTypeGuid: null,
    orderId: null,
    authorizationNumber: null,
    transactionAmountLow: null,
    transactionAmountHigh: null,
  };

  const handleSubmit = (values) => {
    const userName = localStorage.getItem('userName');
    
    const searchParams = {
      ...values,
      userName,
      orderId: values.orderId || null,
      bankGuid: bankOption?.value || undefined,
      currencyGuid: currencyOption?.value || undefined,
      ravenTransactionTypeGuid: transactionTypeOption?.value || undefined,
    };
    
    dispatch(getTransactionProvisions(searchParams));
  };
  
  const bankOptions = banks?.map(bank => ({
    value: bank.guid,
    label: bank.bankName || bank.name
  }));

  const currencyOptions = currencies.map(currency => ({
    value: currency.guid,
    label: `${currency.alphabeticCode} - ${currency.currencyName}`
  }));

  const transactionTypeOptions = transactionTypes.map(type => ({
    value: type.guid,
    label: `${type.ravenTransactionCode} - ${type.description}`
  }));

  return (
    <Card className="mb-4">
      <Card.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <SelectField
                    label={t('transaction.bankName')}
                    options={bankOptions}
                    value={bankOption}
                    onChange={(option) => setBankOption(option)}
                    placeholder={t('common.select')}
                  />
                </Col>
                <Col md={4}>
                  <SelectField
                    label={t('transaction.currency')}
                    options={currencyOptions}
                    value={currencyOption}
                    onChange={(option) => setCurrencyOption(option)}
                    placeholder={t('common.select')}
                  />
                </Col>
                <Col md={4}>
                  <SelectField
                    label={t('transaction.transactionType')}
                    options={transactionTypeOptions}
                    value={transactionTypeOption}
                    onChange={(option) => setTransactionTypeOption(option)}
                    placeholder={t('common.select')}
                  />
                </Col>
              </Row>
              
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('transaction.transactionStartDate')}</Form.Label>
                    <Form.Control
                      type="date"
                      name="transactionStartDate"
                      value={values.transactionStartDate || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('transaction.transactionEndDate')}</Form.Label>
                    <Form.Control
                      type="date"
                      name="transactionEndDate"
                      value={values.transactionEndDate || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('transaction.orderId')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="orderId"
                      value={values.orderId || ''}
                      onChange={handleChange}
                      isInvalid={touched.orderId && !!errors.orderId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.orderId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('transaction.authorizationNumber')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="authorizationNumber"
                      value={values.authorizationNumber || ''}
                      onChange={handleChange}
                      isInvalid={touched.authorizationNumber && !!errors.authorizationNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.authorizationNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('transaction.transactionAmountLow')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="transactionAmountLow"
                      value={values.transactionAmountLow || ''}
                      onChange={handleChange}
                      isInvalid={touched.transactionAmountLow && !!errors.transactionAmountLow}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.transactionAmountLow}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('transaction.transactionAmountHigh')}</Form.Label>
                    <Form.Control
                      type="text"
                      name="transactionAmountHigh"
                      value={values.transactionAmountHigh || ''}
                      onChange={handleChange}
                      isInvalid={touched.transactionAmountHigh && !!errors.transactionAmountHigh}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.transactionAmountHigh}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? t('common.searching') : t('common.search')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default SearchProvision; 