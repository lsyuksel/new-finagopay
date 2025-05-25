import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetailTransaction() {
    const { param } = useParams();
    const { t } = useTranslation();
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authData = useSelector((state) => state.auth);

    return (
        <div>
            <h3>DetailTransaction Id:{param}</h3>
        </div>
    )
}
