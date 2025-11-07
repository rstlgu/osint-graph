'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '@/components/ui/menubar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  IconPlus,
  IconTrash,
  IconDownload,
  IconUpload,
  IconMail,
  IconWorld,
  IconDeviceDesktop,
  IconUser,
  IconAt,
  IconPhone,
  IconCircle
} from '@tabler/icons-react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useState } from 'react';
import { useTheme } from 'next-themes';
import { OSINTNode, OSINTNodeData } from './osint-node';
import { OSINTEdge } from './osint-edge';

const nodeTypes = {
  osint: OSINTNode
};

const edgeTypes = {
  osint: OSINTEdge
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'osint',
    position: { x: 250, y: 100 },
    data: {
      label: 'example@email.com',
      type: 'email',
      metadata: {
        verified: true,
        source: 'manual'
      }
    }
  },
  {
    id: '2',
    type: 'osint',
    position: { x: 100, y: 300 },
    data: {
      label: 'example.com',
      type: 'domain',
      metadata: {
        registrar: 'Example Registrar',
        source: 'manual'
      }
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'osint',
    data: {
      relationship: 'associated_with',
      label: 'Associato a'
    }
  }
];

const nodeTypeOptions: Array<{
  value: OSINTNodeData['type'];
  label: string;
  icon: typeof IconMail;
}> = [
  { value: 'email', label: 'Email', icon: IconMail },
  { value: 'domain', label: 'Dominio', icon: IconWorld },
  { value: 'ip', label: 'IP Address', icon: IconDeviceDesktop },
  { value: 'person', label: 'Persona', icon: IconUser },
  { value: 'username', label: 'Username', icon: IconAt },
  { value: 'phone', label: 'Telefono', icon: IconPhone },
  { value: 'generic', label: 'Generico', icon: IconCircle }
];

export default function GraphViewPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] =
    useState<OSINTNodeData['type']>('email');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'osint',
            data: {
              relationship: 'related_to',
              label: 'Relazionato a'
            }
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node<OSINTNodeData> = {
      id: `${Date.now()}`,
      type: 'osint',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500
      },
      data: {
        label: `Nuovo ${selectedNodeType}`,
        type: selectedNodeType,
        metadata: {
          source: 'manual'
        }
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, selectedNodeType]);

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const selectedNodeTypeConfig = nodeTypeOptions.find(
    (opt) => opt.value === selectedNodeType
  );
  const SelectedIcon = selectedNodeTypeConfig?.icon || IconCircle;

  return (
    <div className='relative h-screen w-full overflow-hidden'>
      {/* React Flow Canvas - Full Screen */}
      <div className='absolute inset-0 h-screen w-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className='bg-background'
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const typeColors: Record<string, string> = {
                email: '#3b82f6',
                domain: '#10b981',
                ip: '#f59e0b',
                person: '#8b5cf6',
                username: '#ec4899',
                phone: '#06b6d4',
                generic: '#6b7280'
              };
              return typeColors[node.data?.type] || '#6b7280';
            }}
            style={{
              backgroundColor: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))',
              border: `1px solid hsl(var(--border))`
            }}
            maskColor={
              isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'
            }
          />
        </ReactFlow>
      </div>

      {/* Floating Menubar */}
      <Menubar className='absolute top-4 left-4 z-10 shadow-lg'>
        <MenubarMenu>
          <MenubarTrigger className='gap-2'>
            <SelectedIcon className='h-4 w-4' />
            <span>Tipo Nodo</span>
          </MenubarTrigger>
          <MenubarContent>
            {nodeTypeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <MenubarItem
                  key={option.value}
                  onClick={() => setSelectedNodeType(option.value)}
                  className='gap-2'
                >
                  <Icon className='h-4 w-4' />
                  <span>{option.label}</span>
                  {selectedNodeType === option.value && (
                    <span className='ml-auto'>✓</span>
                  )}
                </MenubarItem>
              );
            })}
          </MenubarContent>
        </MenubarMenu>

        <MenubarSeparator />

        <Button
          variant='ghost'
          size='sm'
          onClick={addNode}
          className='h-9 gap-2 rounded-sm px-2 py-1'
        >
          <IconPlus className='h-4 w-4' />
          <span>Aggiungi Nodo</span>
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={clearGraph}
          className='h-9 gap-2 rounded-sm px-2 py-1'
        >
          <IconTrash className='h-4 w-4' />
          <span>Pulisci Grafo</span>
        </Button>

        <MenubarSeparator />

        <Button
          variant='ghost'
          size='sm'
          className='h-9 gap-2 rounded-sm px-2 py-1'
        >
          <IconDownload className='h-4 w-4' />
          <span>Esporta</span>
        </Button>

        <Button
          variant='ghost'
          size='sm'
          className='h-9 gap-2 rounded-sm px-2 py-1'
        >
          <IconUpload className='h-4 w-4' />
          <span>Importa</span>
        </Button>

        <MenubarSeparator />

        <div className='flex items-center gap-2 px-2'>
          <Badge variant='secondary'>{nodes.length} Nodi</Badge>
          <Badge variant='secondary'>{edges.length} Connessioni</Badge>
        </div>
      </Menubar>
    </div>
  );
}
