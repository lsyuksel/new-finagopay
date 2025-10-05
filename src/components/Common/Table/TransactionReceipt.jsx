import React, { useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import '../../../assets/css/receipt.scss';
import logo from '../../../assets/images/logo.png';
import morposSignature from '../../../assets/images/morpos-imza.png';
/*
// Tek veri hazırlama fonksiyonu
const prepareReceiptData = (data = {}) => ({
  receiptNo: data?.receiptNo || 'AOP0250000000001',
  transactionType: data?.transactionType || 'Satış',
  refNo: data?.refNo || '29000822052',
  transactionDate: data?.transactionDate || '01.01.2025 10:05:00',
  printDate: data?.printDate || '10.03.2025 07:54:02',
  amount: data?.amount || '39,31₺',
  commission: data?.commission || '-',
  bsmv: data?.bsmv || '-',
  toBePaid: data?.toBePaid || '-',
  note: data?.note || 'Açıklama notu',
  rate: data?.rate || '39,3120',
  emoneyInstitution: {
    name: 'A Ödeme ve Elektronik Para Hizmetleri A.Ş.',
    taxOffice: 'ZİNCİRLİKUYU',
    taxNo: '00125126477',
    mersis: '00001215647700001',
    address: 'Esenyete Mah. Büyükdere Cad. No: 127/63 Astoria AVM Şişli/İstanbul',
    website: 'www.morpara.com',
  },
  merchant: {
    name: data?.merchantName || '-',
    taxOffice: data?.merchantTaxOffice || '-',
    taxNo: data?.merchantTaxNo || '-',
    mersis: data?.merchantMersis || '-',
    address: data?.merchantAddress || '-',
    website: data?.merchantWebsite || '-',
  },
});
*/
const TransactionReceipt = ({ visible, onHide, modalData }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log('modalData', modalData);
  }, [modalData]);

  const receiptRef = useRef(null);

  const handleDownloadFromDom = async () => {
    if (!receiptRef.current) return;
    const pdf = await createReceiptPdf(receiptRef.current);
    pdf.save(`dekont-${modalData.receiptNumber}.pdf`);
  };
  
  const renderFooter = () => {
    return (
      <div className='d-flex gap-4 justify-content-end'>
        <Button label="PDF indir" className="filter-button mx-0" onClick={handleDownloadFromDom} autoFocus />
      </div>
    );
  };

  return (
    <Dialog 
      className='filter-modal-dialog overflow'
      visible={visible} 
      style={{ width: '75%' }} 
      footer={renderFooter()} 
      onHide={onHide}
    >
      { modalData && (
        <div 
          ref={receiptRef} 
          className="receipt" 
          dangerouslySetInnerHTML={{ __html: renderReceiptHtml(modalData) }}
          />
        )
      }
      
    </Dialog>
  );
};

export default TransactionReceipt; 

// Tek HTML render fonksiyonu
const renderReceiptHtml = (data) => {
  return `
    <div class="receipt__header">
      <img src="${logo}" alt="logo" class="receipt__logo" />
      <div class="receipt__header-center">
        <div class="receipt__title">DEKONT</div>
        <div class="receipt__subtitle">(ELEKTRONİK PARA KURULUŞU)</div>
      </div>
    </div>
    <div class="receipt__org">A Ödeme ve Elektronik Para Hizmetleri Anonim Şirketi</div>
    <table class="receipt__table"><tbody>
      ${[
        ['Dekont No / Receipt No', data?.receiptNumber || '-'],
        ['İşlem Türü / Transaction Type', data?.transactionType || '-'],
        ['Referans No / Transaction Ref No', data?.transactionRefNumber || '-'],
        ['İşlem Tarihi / Transaction Date', data?.transactionDate || '-'],
        ['Düzenlenme Tarihi / Receipt Date', data?.receiptDate || '-'],
      ].map(r => `
        <tr>
          <td class="receipt__th">${r[0]}</td>
          <td class="receipt__sep">:</td>
          <td class="receipt__td">${r[1]}</td>
        </tr>
      `).join('')}
    </tbody></table>
    <div class="receipt__org">İşlem Bilgileri / Transaction Details</div>
    <table class="receipt__table"><tbody>
      ${[
        ['İşlem Tutarı / Transaction Amount', data?.transactionInfo?.transactionAmount + ' ' + data?.transactionInfo?.currencyName || '-'],
        ['Komisyon Tutarı / Commission Fee', data?.transactionInfo?.comissionAmount + ' ' + data?.transactionInfo?.currencyName || '-'],
        ['BSMV / BITT Tax', data?.transactionInfo?.bsmvAmount + ' ' + data?.transactionInfo?.currencyName || '-'],
        ['Üye İşyerine Ödenecek Tutar / Amount To Be Paid', data?.transactionInfo?.transactionNetAmount || '-'],
        ['Yalnız/Only', data?.transactionInfo?.onlyInWriting || '-'],
        
        
        ['İşlem Açıklaması / Transaction Description', data?.transactionInfo?.description || '-'],


        ['Uygulanan Kur / Exchange Rate', data?.transactionInfo?.exchangeRate || '-'],
      ].map(r => `
        <tr>
          <td class="receipt__th">${r[0]}</td>
          <td class="receipt__sep">:</td>
          <td class="receipt__td">${r[1]}</td>
        </tr>
      `).join('')}
    </tbody></table>
    <div class="receipt__columns">
      <div class="receipt__col">
        <div class="receipt__org">Elektronik Para Kuruluşunun<div class="receipt__col-sub">(E-Money Institution)</div></div>
        <table class="receipt__table"><tbody>
          ${[
            ['Unvan / Trade Name', data?.payFacInfo?.tradeName || '-'],
            ['Vergi Dairesi / Tax Office', data?.payFacInfo?.taxOffice || '-'],
            ['Vergi No / Tax No', data?.payFacInfo?.taxNumber || '-'],
            ['MERSİS No / Central Registry System', data?.payFacInfo?.mersisNumber || '-'],
            ['Adres / Address', data?.payFacInfo?.address || '-'],
            ['İnternet Sitesi / Website', data?.payFacInfo?.webUrl || '-'],
          ].map(r => `
            <tr>
              <td class="receipt__th">${r[0]}</td>
              <td class="receipt__sep">:</td>
              <td class="receipt__td">${r[1]}</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
      <div class="receipt__col">
        <div class="receipt__org">Üye İşyeri<div class="receipt__col-sub">(Merchant of E-Money Institution)</div></div>
        <table class="receipt__table"><tbody>
          ${[
            ['Unvan / Trade Name', data?.merchantInfo?.tradeName || '-'],
            ['Vergi Dairesi / Tax Office', data?.merchantInfo?.taxOffice || '-'],
            ['Vergi No / Tax No', data?.merchantInfo?.taxNumber || '-'],
            ['MERSİS No / Central Registry System', data?.merchantInfo?.mersisNumber || '-'],
            ['Adres / Address', data?.merchantInfo?.address || '-'],
            ['İnternet Sitesi / Website', data?.merchantInfo?.webUrl || '-'],
          ].map(r => `
            <tr>
              <td class="receipt__th">${r[0]}</td>
              <td class="receipt__sep">:</td>
              <td class="receipt__td">${r[1]}</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>
    <div class="receipt__footer">
      <img src="${morposSignature}" class="receipt__footer-img" />
    </div>
  `;
};

// Tek PDF oluşturma fonksiyonu (export edilebilir)
export const createReceiptPdf = async (element) => {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
  heightLeft -= (pageHeight - margin * 2);

  while (heightLeft > 0) {
    pdf.addPage();
    position = margin - (imgHeight - heightLeft);
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);
  }

  return pdf;
};

// Direkt modal açmadan PDF indirme (public API)
export const downloadReceiptDirect = async (data = {}) => {
  // Geçici, ekrandan gizli bir DOM oluştur
  const wrapper = document.createElement('div');
  wrapper.className = 'receipt-dialog-hidden';
  const container = document.createElement('div');
  container.className = 'receipt';
  container.innerHTML = renderReceiptHtml(data);
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  // PDF üretimi
  const pdf = await createReceiptPdf(container);
  pdf.save(`dekont-${data?.receiptNumber || 'unknown'}.pdf`);

  // Temizlik
  document.body.removeChild(wrapper);
};