import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.dashboards')}
      </h4>
      <Row>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>İstatistikler</Card.Title>
              <Card.Text>
                Dashboard içeriği burada yer alacak.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 