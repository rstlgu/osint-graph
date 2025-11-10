'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarCheckboxItem
} from '@/components/ui/menubar';
import { Badge } from '@/components/ui/badge';
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
  IconCircle,
  IconGridDots
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
  BackgroundVariant,
  MarkerType,
  reconnectEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { OSINTNode, OSINTNodeData } from './osint-node';
import { OSINTEdge } from './osint-edge';

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
    markerEnd: {
      type: MarkerType.ArrowClosed
    },
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
  const [showGrid, setShowGrid] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const edgeReconnectSuccessful = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Definiamo i tipi dentro il componente per assicurarci che siano sempre disponibili
  const nodeTypes = {
    osint: OSINTNode
  };

  const edgeTypes = {
    osint: OSINTEdge
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'osint',
            markerEnd: {
              type: MarkerType.ArrowClosed
            }
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Gestione riconnessione edge
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [setEdges]
  );

  const addNode = useCallback(
    (nodeType: OSINTNodeData['type']) => {
      const newNode: Node<OSINTNodeData> = {
        id: `${Date.now()}`,
        type: 'osint',
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500
        },
        data: {
          label: `Nuovo ${nodeType}`,
          type: nodeType,
          metadata: {
            source: 'manual'
          }
        }
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const exportGraph = useCallback(() => {
    const graphData = {
      nodes,
      edges
    };
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grafo-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importGraph = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const graphData = JSON.parse(event.target?.result as string);
            if (graphData.nodes && graphData.edges) {
              setNodes(graphData.nodes);
              setEdges(graphData.edges);
            }
          } catch (error) {
            console.error("Errore durante l'importazione:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div className='relative h-full w-full overflow-hidden'>
      {/* React Flow Canvas - Full Screen */}
      <div className='absolute inset-0 h-full w-full'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className='bg-background'
        >
          {showGrid && (
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          )}
          <Controls />
          {mounted && (
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
                backgroundColor: 'hsl(var(--card))',
                border: `1px solid hsl(var(--border))`
              }}
              maskColor={
                isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'
              }
            />
          )}
        </ReactFlow>
      </div>

      {/* Floating Menubar */}
      <Menubar className='absolute top-4 left-4 z-10 shadow-lg'>
        <MenubarMenu>
          <MenubarTrigger className='gap-2'>
            <IconPlus className='h-4 w-4' />
            <span>Aggiungi Nodo</span>
          </MenubarTrigger>
          <MenubarContent>
            {nodeTypeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <MenubarItem
                  key={option.value}
                  onClick={() => addNode(option.value)}
                  className='gap-2'
                >
                  <Icon className='h-4 w-4' />
                  <span>{option.label}</span>
                </MenubarItem>
              );
            })}
          </MenubarContent>
        </MenubarMenu>

        <MenubarSeparator />

        <MenubarMenu>
          <MenubarTrigger className='gap-2'>
            <IconGridDots className='h-4 w-4' />
            <span>Grafo</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={clearGraph}
              className='gap-2'
              variant='destructive'
            >
              <IconTrash className='h-4 w-4' />
              <span>Pulisci Grafo</span>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={exportGraph} className='gap-2'>
              <IconDownload className='h-4 w-4' />
              <span>Esporta</span>
            </MenubarItem>
            <MenubarItem onClick={importGraph} className='gap-2'>
              <IconUpload className='h-4 w-4' />
              <span>Importa</span>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
              className='gap-2'
            >
              <IconGridDots className='h-4 w-4' />
              <span>Mostra Griglia</span>
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarSeparator />

        <div className='flex items-center gap-2 px-2'>
          <Badge variant='secondary'>{nodes.length} Nodi</Badge>
          <Badge variant='secondary'>{edges.length} Connessioni</Badge>
        </div>
      </Menubar>
    </div>
  );
}
