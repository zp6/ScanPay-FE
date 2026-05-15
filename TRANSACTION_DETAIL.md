# Transaction Detail View

## Page: app/transactions/[id]/page.tsx

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TransactionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [tx, setTx] = useState(null);

  useEffect(() => {
    fetch(`/api/transactions/${id}`).then(r => r.json()).then(setTx);
  }, [id]);

  if (!tx) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <button onClick={() => router.back()} className="mb-4">Back</button>
      
      <div className="text-center mb-6">
        <span className={`badge ${tx.status}`}>
          {tx.status}
        </span>
        <div className={`text-3xl font-bold ${tx.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
          {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.currency}
        </div>
      </div>

      <div className="divide-y">
        <Row label="Hash" value={tx.hash} copyable />
        <Row label="From" value={tx.from} copyable />
        <Row label="To" value={tx.to} copyable />
        <Row label="Fee" value={`${tx.fee} ${tx.currency}`} />
        <Row label="Block" value={`#${tx.blockNumber}`} />
        <Row label="Time" value={new Date(tx.timestamp).toLocaleString()} />
      </div>

      <a href={`#/tx/${tx.hash}`} target="_blank" className="text-primary">View on Explorer</a>
    </div>
  );
}

function Row({ label, value, copyable }) {
  return (
    <div className="flex justify-between py-4">
      <span className="text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono truncate max-w-xs">{value}</span>
        {copyable && <button onClick={() => navigator.clipboard.writeText(value)}>Copy</button>}
      </div>
    </div>
  );
}
```

Features: status badge, send/receive color coding, copyable hashes, explorer link
