// src/components/ActionPanel.tsx
import React, { useState } from 'react';
import { ActionType, ActionOptionType, ActionOption } from '../types';
import ConvertAction from './actions/ConvertAction';
import CombineAction from './actions/CombineAction';
import ReduceSizeAction from './actions/ReduceSizeAction';
import FileRenameAction from './actions/FileRenameAction';
import CompressAction from './actions/CompressAction';
import ResizeImagesAction from './actions/ResizeImagesAction';
import AddActionMenu from './AddActionMenu';
import DraggableActionItem from './DraggableActionItem';
import { useActions } from '../context';
import styles from './ActionPanel.module.css';

interface ActionPanelProps {
  actions: ActionType[];
  onAddAction: (action: ActionOptionType) => void;
  onDeleteAction: (id: string) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
                                                   actions,
                                                   onAddAction,
                                                   onDeleteAction
                                                 }) => {
  const [showAddMenu, setShowAddMenu] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { reorderActions } = useActions();

  const actionOptions: ActionOption[] = [
    {
      id: 'convert',
      title: 'Convert file to other format',
      type: ActionOptionType.ConvertFormat,
      icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
      )
    },
    {
      id: 'resize',
      title: 'Resize images',
      type: ActionOptionType.ResizeImages,
      icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
      )
    },
    {
      id: 'reduce',
      title: 'Reduce file size',
      type: ActionOptionType.ReduceSize,
      icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
      )
    },
    {
      id: 'compress',
      title: 'Compress files',
      type: ActionOptionType.CompressFiles,
      icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
      )
    },
    {
      id: 'rename',
      title: 'File renaming',
      type: ActionOptionType.FileRenaming,
      icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
      )
    },
    {
      id: 'combine',
      title: 'Combine files together',
      type: ActionOptionType.CombineFiles,
      icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
      )
    }
  ];

  const handleAddAction = (type: ActionOptionType) => {
    onAddAction(type);
    setShowAddMenu(false);
  };

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderActions(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const renderAction = (action: ActionType, index: number) => {
    let actionComponent;

    switch (action.type) {
      case ActionOptionType.ConvertFormat:
        actionComponent = (
            <ConvertAction
                action={action}
                onDelete={() => onDeleteAction(action.id)}
            />
        );
        break;
      case ActionOptionType.CombineFiles:
        actionComponent = (
            <CombineAction
                action={action}
                onDelete={() => onDeleteAction(action.id)}
            />
        );
        break;
      case ActionOptionType.ReduceSize:
        actionComponent = (
            <ReduceSizeAction
                action={action}
                onDelete={() => onDeleteAction(action.id)}
            />
        );
        break;
      case ActionOptionType.FileRenaming:
        actionComponent = (
            <FileRenameAction
                action={action}
                onDelete={() => onDeleteAction(action.id)}
            />
        );
        break;
      case ActionOptionType.CompressFiles:
        actionComponent = (
            <CompressAction
                action={action}
                onDelete={() => onDeleteAction(action.id)}
            />
        );
        break;
      case ActionOptionType.ResizeImages:
        actionComponent = (
            <ResizeImagesAction
                action={action}
                onDelete={() => onDeleteAction(action.id)}
            />
        );
        break;
      default:
        return null;
    }

    return (
        <DraggableActionItem
            key={action.id}
            action={action}
            index={index}
            onDelete={() => onDeleteAction(action.id)}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            isDragging={draggedIndex === index}
            className="my-4"
        >
          {actionComponent}
        </DraggableActionItem>
    );
  };

  return (
      <div className={styles.actionPanelBg}>
        {actions.length > 0 && (
            <div className={styles.dragHint}>
              <svg className={styles.dragIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Drag to reorder actions
            </div>
        )}

        <div className={styles.actionList}>
          {actions.map((action, index) => renderAction(action, index))}
        </div>

        {/* Add action floating button */}
        <div className={styles.addActionFabWrapper}>
          <button
            className={styles.addActionFab}
            onClick={() => setShowAddMenu(!showAddMenu)}
            aria-label="Add action"
          >
            +
          </button>
          {showAddMenu && (
            <div className={styles.addActionMenu}>
              {actionOptions.map(option => (
                <button
                  key={option.id}
                  className={styles.addActionMenuItem}
                  onClick={() => handleAddAction(option.type)}
                >
                  <span className={styles.addActionMenuIcon}>{option.icon}</span>
                  {option.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

export default ActionPanel;