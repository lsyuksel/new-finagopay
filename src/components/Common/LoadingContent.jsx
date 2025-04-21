import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const LoadingContent = ({ loading, children, className }) => {
    return loading ? (
        <div className={`skeleton-container ${className || ''}`}>
            <Skeleton className="skeleton-box" />
        </div>
    ) : (
        children
    );
};

export default LoadingContent;