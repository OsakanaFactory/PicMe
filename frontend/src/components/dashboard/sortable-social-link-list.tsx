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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SocialLink } from '@/lib/social-links';
import { GripVertical, Link as LinkIcon, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Twitter': return <Twitter className="h-5 w-5" />;
    case 'Instagram': return <Instagram className="h-5 w-5" />;
    case 'Facebook': return <Facebook className="h-5 w-5" />;
    case 'YouTube': return <Youtube className="h-5 w-5" />;
    default: return <LinkIcon className="h-5 w-5" />;
  }
};

interface SortableSocialLinkItemProps {
  link: SocialLink;
}

function SortableSocialLinkItem({ link }: SortableSocialLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing hover:bg-slate-100 p-1 rounded transition-colors"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
        {getPlatformIcon(link.platform)}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-slate-900">{link.platform}</h4>
        <p className="text-xs text-slate-500 truncate">{link.url}</p>
      </div>
    </div>
  );
}

interface SortableSocialLinkListProps {
  links: SocialLink[];
  onReorder: (linkIds: number[]) => void;
}

export function SortableSocialLinkList({ links, onReorder }: SortableSocialLinkListProps) {
  const [items, setItems] = useState(links);

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
      <SortableContext items={items.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map(link => (
            <SortableSocialLinkItem key={link.id} link={link} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
