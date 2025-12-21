import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "primereact/carousel";

export default function BannerSlider({ images }) {
  const { t } = useTranslation();

  const bannerTemplate = (item) => {
    return (
      <div className="banner">
        <a href={item.link}>
          <img src={`${item.image}`}/>
        </a>
      </div>
    );
  };
  
  return (
    <div className="item-banner-slider">
      <Carousel
        value={images}
        numVisible={1}
        numScroll={1}
        itemTemplate={bannerTemplate}
        showNavigators={false}
      />
    </div>
  );
}
