'use client';

import { EdgeProps, getBezierPath } from 'reactflow';
import { BaseEdge, EdgeLabelRenderer } from 'reactflow';

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
  data,
  markerEnd
}: EdgeProps<OSINTEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
          stroke: 'hsl(var(--primary))'
        }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className='bg-background pointer-events-auto absolute rounded-md border px-2 py-1 text-xs font-medium shadow-sm'
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
