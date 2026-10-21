export default function LoadingState({ label = 'Loading records' }: { label?: string }) {
    return <div role="status" className="w-full space-y-3 py-3"><span className="sr-only">{label}</span>{[0, 1, 2].map(row => <div key={row} aria-hidden="true" className="flex gap-4 motion-safe:animate-pulse"><div className="h-4 w-1/4 rounded bg-gray-200" /><div className="h-4 flex-1 rounded bg-gray-100" /><div className="h-4 w-1/6 rounded bg-gray-100" /></div>)}</div>;
}
