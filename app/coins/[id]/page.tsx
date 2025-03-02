import { notFound } from 'next/navigation';
import { CoinChart } from '@/components/CoinChart';

interface CoinPageProps {
  params: {
    id: string;
  };
}

export default async function CoinPage({ params }: CoinPageProps) {
  const { id } = params;

  return (
    <div className="p-8">
      <CoinChart coinId={id} />
    </div>
  );
}