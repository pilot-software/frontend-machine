'use client';

import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface DraggableStatCardsProps {
  children: React.ReactNode;
  onReorder?: (order: string[]) => void;
}

export function DraggableStatCards({
  children,
  onReorder,
}: DraggableStatCardsProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const container = e.currentTarget.parentElement;
      if (container) {
        const cards = Array.from(container.children) as HTMLElement[];
        const draggedIndex = cards.findIndex(
          (card) => card.getAttribute('data-card-id') === draggedId
        );
        const targetIndex = cards.findIndex(
          (card) => card.getAttribute('data-card-id') === targetId
        );

        if (draggedIndex > targetIndex) {
          cards[targetIndex].parentNode?.insertBefore(
            cards[draggedIndex],
            cards[targetIndex]
          );
        } else {
          cards[targetIndex].parentNode?.insertBefore(
            cards[draggedIndex],
            cards[targetIndex].nextSibling
          );
        }

        const newOrder = cards.map((card) => card.getAttribute('data-card-id')).filter(Boolean) as string[];
        onReorder?.(newOrder);
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      onDragEnd={handleDragEnd}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const cardId = child.props['data-card-id'];
        if (!cardId) return child;

        return (
          <div
            key={cardId}
            data-card-id={cardId}
            draggable
            onDragStart={(e) => handleDragStart(e, cardId)}
            onDragOver={(e) => handleDragOver(e, cardId)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, cardId)}
            className={`relative transition-all cursor-move ${
              draggedId === cardId ? 'opacity-50' : ''
            } ${dragOverId === cardId ? 'scale-105 ring-2 ring-primary' : ''}`}
          >
            <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity z-10">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            {child}
          </div>
        );
      })}
    </div>
  );
}
