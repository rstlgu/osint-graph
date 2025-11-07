import GraphViewPage from '@/features/graph/components/graph-view-page';

export const metadata = {
  title: 'Dashboard: OSINT Graph'
};

export default function Page() {
  return (
    <div className='h-screen w-full overflow-hidden'>
      <GraphViewPage />
    </div>
  );
}
