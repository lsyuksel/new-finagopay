import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  
  if (totalPages <= 1) return null;

  const items = [];

  // İlk sayfa
  items.push(
    <BootstrapPagination.First
      key="first"
      disabled={currentPage === 1}
      onClick={() => onPageChange(1)}
    />
  );

  // Önceki sayfa
  items.push(
    <BootstrapPagination.Prev
      key="prev"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    />
  );

  // Sayfa numaraları
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <BootstrapPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BootstrapPagination.Item>
    );
  }

  // Sonraki sayfa
  items.push(
    <BootstrapPagination.Next
      key="next"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    />
  );

  // Son sayfa
  items.push(
    <BootstrapPagination.Last
      key="last"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(totalPages)}
    />
  );

  return <BootstrapPagination>{items}</BootstrapPagination>;
};

export default Pagination; 