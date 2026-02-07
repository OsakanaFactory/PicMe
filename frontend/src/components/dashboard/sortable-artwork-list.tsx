'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Artwork } from '@/lib/artworks';
import { GripVertical } from 'lucide-react';

interface SortableArtworkItemProps {
  artwork: Artwork;
}

function SortableArtworkItem({ artwork }: SortableArtworkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white border-2 border-slate-200 rounded-lg overflow-hidden group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 rounded-md shadow cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      <div className="aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={artwork.thumbnailUrl || artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{artwork.title}</h3>
      </div>
    </div>
  );
}

interface SortableArtworkListProps {
  artworks: Artwork[];
  onReorder: (artworkIds: number[]) => void;
}

export function SortableArtworkList({ artworks, onReorder }: SortableArtworkListProps) {
  const [items, setItems] = useState(artworks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems.map(item => item.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(a => a.id)} strategy={rectSortingStrategy}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(artwork => (
            <SortableArtworkItem key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
