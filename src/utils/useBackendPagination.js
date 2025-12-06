// useBackendPagination.js
import { useState, useCallback, useEffect } from 'react';

export const useBackendPagination = (options = {}) => {
  // options içinde:
  // - initialPageSize: başlangıç sayfa boyutu (örn: 10)
  // - onPaginationChange: pagination değiştiğinde çağrılacak callback
  // - mode: 'backend' veya 'frontend' (opsiyonel)
  
  // State'ler
  const [pageSize, setPageSize] = useState(options.initialPageSize || 10);
  const [pageNumber, setPageNumber] = useState(1); // 0 yerine 1
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // 1 veya -1 (PrimeReact formatı)
  const [totalRecords, setTotalRecords] = useState(0);
  
  // PrimeReact için gerekli değerler
  const [first, setFirst] = useState(0); // PrimeReact'in first değeri
  
  const handlePageChange = useCallback((event) => {
    const newFirst = event.first;
    const newRows = event.rows;
    
    // Backend için pageNumber hesapla (1-based)
    // PrimeReact first: 0, 10, 20, 30...
    // Backend pageNumber: 1, 2, 3, 4...
    const newPageNumber = Math.floor(newFirst / newRows) + 1; // +1 ekle
    
    setFirst(newFirst);
    setPageSize(newRows);
    setPageNumber(newPageNumber);
    
    if (options.onPaginationChange) {
      options.onPaginationChange({
        pageNumber: newPageNumber, // 1-based
        pageSize: newRows,
        sortField: sortField || null, // null olabilir
        descenting: sortOrder === -1 // boolean: true = desc, false = asc
      });
    }
  }, [sortField, sortOrder, options]);

  const handleSortChange = useCallback((event) => {
    const newSortField = event.sortField || null;
    const newSortOrder = event.sortOrder || null;
    
    setSortField(newSortField);
    setSortOrder(newSortOrder);
    
    // Sayfayı sıfırla (1'e dön)
    setPageNumber(1); // 0 yerine 1
    setFirst(0);
    
    if (options.onPaginationChange) {
      options.onPaginationChange({
        pageNumber: 1, // İlk sayfa (1-based)
        pageSize: pageSize,
        sortField: newSortField || null,
        descenting: newSortOrder === -1 // boolean
      });
    }
  }, [pageSize, options]);

  const resetPagination = useCallback(() => {
    setPageNumber(1); // 0 yerine 1
    setFirst(0);
  }, []);
  
  const getPaginationParams = useCallback(() => {
    return {
      pageNumber: pageNumber, // 1-based
      pageSize: pageSize,
      sortField: sortField || null, // null olabilir
      descenting: sortOrder === -1 // boolean: true = desc, false = asc
    };
  }, [pageNumber, pageSize, sortField, sortOrder]);

  return {
    // State'ler
    pageSize,
    pageNumber,
    sortField,
    sortOrder,
    totalRecords,
    first,
    
    // Fonksiyonlar
    handlePageChange,
    handleSortChange,
    resetPagination,
    setTotalRecords,
    getPaginationParams
  };
};