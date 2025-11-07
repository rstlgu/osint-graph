'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconMail,
  IconWorld,
  IconDeviceDesktop,
  IconUser,
  IconAt,
  IconPhone,
  IconCircle
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export interface OSINTNodeData {
  label: string;
  type: 'email' | 'domain' | 'ip' | 'person' | 'username' | 'phone' | 'generic';
  metadata?: Record<string, unknown>;
}

const typeConfig: Record<
  string,
  { icon: typeof IconMail; color: string; bgColor: string }
> = {
  email: {
    icon: IconMail,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
  },
  domain: {
    icon: IconWorld,
    color: 'text-green-600 dark:text-green-400',
    bgColor:
      'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
  },
  ip: {
    icon: IconDeviceDesktop,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor:
      'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
  },
  person: {
    icon: IconUser,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor:
      'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800'
  },
  username: {
    icon: IconAt,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800'
  },
  phone: {
    icon: IconPhone,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800'
  },
  generic: {
    icon: IconCircle,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800'
  }
};

export function OSINTNode({ data }: NodeProps<OSINTNodeData>) {
  const config = typeConfig[data.type] || typeConfig.generic;
  const Icon = config.icon;

  return (
    <div className='px-2 py-2'>
      <Card className={cn('w-[200px] border-2', config.bgColor)}>
        <CardContent className='p-3'>
          <div className='flex items-start gap-2'>
            <Icon
              className={cn('mt-0.5 h-5 w-5 flex-shrink-0', config.color)}
            />
            <div className='min-w-0 flex-1'>
              <div className='truncate text-sm font-semibold'>{data.label}</div>
              <Badge variant='outline' className='mt-1 text-xs'>
                {data.type}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Handle
        type='target'
        position={Position.Top}
        className='!bg-primary !h-3 !w-3'
      />
      <Handle
        type='source'
        position={Position.Bottom}
        className='!bg-primary !h-3 !w-3'
      />
      <Handle
        type='target'
        position={Position.Left}
        className='!bg-primary !h-3 !w-3'
      />
      <Handle
        type='source'
        position={Position.Right}
        className='!bg-primary !h-3 !w-3'
      />
    </div>
  );
}
