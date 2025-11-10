'use client';

import { EdgeProps, getBezierPath, MarkerType, BaseEdge } from 'reactflow';

export interface OSINTEdgeData {
  relationship: string;
  label?: string;
}

export function OSINTEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  selected
}: EdgeProps<OSINTEdgeData>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd || MarkerType.ArrowClosed}
      style={{
        strokeWidth: selected ? 3 : 2,
        stroke: '#3b82f6',
        opacity: selected ? 1 : 0.9
      }}
    />
  );
}
