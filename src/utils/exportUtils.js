import * as xlsx from 'xlsx';
import fileSaver from 'file-saver';
import { t } from 'i18next';
import { formatDate } from './helpers';

export const formatTransactionItemForExport = (item, columns, selectOptions) => {
  return columns.map(col => {
    const rawValue = item[col.field];
    let cellValue = '';

    switch (col.field) {
      case 'ravenTransactionTypeGuid':
        const tt = selectOptions.allTransactionType?.find((opt) => opt.guid == Number(rawValue));
        cellValue = tt ? tt.description : '';
        break;
      case 'insertDateTime':
        cellValue = formatDate(rawValue);
        break;
      case 'preauthorizationDate':
        cellValue = formatDate(rawValue);
        break;
      case 'preauthorizationClosingDateTime':
        cellValue = formatDate(rawValue);
        break;
      case 'transactionNetworkGuid':
        const tn = selectOptions.allTransactionNetwork?.find((opt) => opt.guid == Number(rawValue));
        cellValue = tn ? tn.description : '';
        break;
      case 'ravenAuthorizationResponseCodeGuid':
        const arc = selectOptions.allAuthorizationResponseCode?.find((opt) => opt.guid == Number(rawValue));
        cellValue = arc ? arc.description : '';
        break;
      case 'cardTypeGuid':
        const ct = selectOptions.allCardTypeName?.find((opt) => opt.guid == Number(rawValue));
        cellValue = ct ? ct.description : '';
        break;
      case 'provisionStatusGuid':
        const ps = selectOptions.allProvisionStatus?.find((opt) => opt.guid == Number(rawValue));
        cellValue = ps ? ps.name : ''; 
        break;
      case 'installmentTypeGuid':
        const it = selectOptions.allInstallmentType?.find((opt) => opt.guid == Number(rawValue));
        cellValue = it ? it.description : '';
        break;
      case 'posEntryModeGuid':
        const pem = selectOptions.allPosEntryMode?.find((opt) => opt.guid == Number(rawValue));
        cellValue = pem ? pem.description : '';
        break;
      case 'bankGuid':
        const bank = selectOptions.allBankName?.find((opt) => opt.guid == Number(rawValue));
        cellValue = bank ? bank.bankName : '';
        break;
      case 'f043cardAcceptorCountryCode':
         const country = selectOptions.allCardAcceptorCountry?.find((opt) => opt.numericCode == Number(rawValue));
         cellValue = country ? country.countryName : '';
         break;
      case 'securityLevelIndicator':
        const sli = selectOptions.allSecurityLevelIndicator?.find((opt) => opt.guid == Number(rawValue));
        cellValue = sli ? sli.description : '';
        break;
      case 'f049':
      case 'f050':
        const currency = selectOptions.currencyDef?.find((opt) => opt.numericCode == Number(rawValue));
        cellValue = currency ? currency.currencyName : '';
        break;
      case 'isCapture':
        cellValue = rawValue ? t('common.yes') : t('common.no');
        break;
      default:
        cellValue = rawValue != null ? String(rawValue) : '';
    }

    return cellValue;
  });
};

export const convertToCSV = (dataArray) => {
  const csvRows = [];
  for (const row of dataArray) {
    const values = row.map(cell => {
      const stringValue = String(cell ?? '').trim();
      const needsQuoting = stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r');
      const escapedValue = stringValue.replace(/"/g, '""');

      return needsQuoting ? `"${escapedValue}"` : escapedValue;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

export const saveAsExcelFile = (buffer, fileName) => {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
};

export const exportDataToExcel = (dataList, columns, selectOptions, fileName = 'data') => {
  const headers = columns.map(col => col.header);

  const data = dataList.map(item =>
    formatTransactionItemForExport(item, columns, selectOptions, t, formatDate)
  );

  const sheetData = [headers, ...data];
  const worksheet = xlsx.utils.aoa_to_sheet(sheetData);

  const colWidths = sheetData[0].map((header, i) => {
    let maxCharCount = header.length;
    for (let j = 1; j < sheetData.length; j++) {
      const cell = sheetData[j][i];
      if (cell != null) {
        maxCharCount = Math.max(maxCharCount, String(cell).length);
      }
    }
    return { wch: maxCharCount + 2 };
  });

  worksheet['!cols'] = colWidths;

  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
  });
  saveAsExcelFile(excelBuffer, fileName);
};

export const exportDataToCSV = (dataList, columns, selectOptions, fileName = 'data') => {
  const headers = columns.map(col => col.header);

  const data = dataList.map(item =>
    formatTransactionItemForExport(item, columns, selectOptions, t, formatDate)
  );

  const sheetData = [headers, ...data];
  const csvString = convertToCSV(sheetData);

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  fileSaver.saveAs(blob, `${fileName}_export_${new Date().getTime()}.csv`);
};