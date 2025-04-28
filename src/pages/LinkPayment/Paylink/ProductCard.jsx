import React from "react";
import { t } from "i18next";
import linkIcon from "@/assets/images/icons/linkIcon.svg";

import footerBankIcon1 from "@/assets/images/icons/footer-bank-1.svg";
import footerBankIcon2 from "@/assets/images/icons/footer-bank-2.svg";
import footerBankBanner from "@/assets/images/icons/footer-bank.svg";

export default function ProductCard({
  productImage,
  title,
  description,
  price,
  priceCurrency,
  linkUrlKey,
}) {
  return (
    <div className="link-product-card">
      <div className="sub-text">
        <img src={linkIcon} alt="" />
        <span>{t("linkPayment.linkPreviewModalTitle2")}</span>
      </div>
      <div className="product-infos">
        <div className="product-img">
          <img src={`data:image/png;base64,${productImage}`} alt={title} />
        </div>
        <div className="product-content">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
          <div className="price">
            {price} {priceCurrency}
          </div>
        </div>
      </div>
      <div className="product-footer-bank">
        <div>
        <img src={footerBankIcon1} alt="" />
          <span>{t("linkPayment.linkPreviewModalTitle2")}</span>
        </div>
        <div>
        <img src={footerBankIcon2} alt="" />
          <span>{t("linkPayment.linkPreviewModalTitle2")}</span>
        </div>
        <div>
          <img src={footerBankBanner} alt="" />
        </div>
      </div>
    </div>
  );
}