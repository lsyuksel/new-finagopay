import React from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { t } from 'i18next';

export default function AccordionList({data,title,link}) {
  return (
    <div className='accordion-container'>
    <div className="accordion-title">
        <span>{title}</span>
        <a href={link}>{t('faq.goAllTopics')}</a>
    </div>
    <Accordion activeIndex={0}>
        {
            data && data.map((item, index)=> (
                <AccordionTab key={index} header={item.title}>
                    <p className="m-0">
                        {item.content}
                    </p>
                </AccordionTab>
            ))
        }
    </Accordion>
    </div>
  )
}