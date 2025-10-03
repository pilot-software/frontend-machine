import React from 'react';

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({message = 'Loading...', className = ''}: LoadingStateProps) {
    return (
        <div className={`flex items-center justify-center py-8 ${className}`}>
            <div className="text-sm text-muted-foreground">{message}</div>
        </div>
    );
}
