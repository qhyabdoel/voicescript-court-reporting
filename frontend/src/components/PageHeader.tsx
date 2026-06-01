export default function PageHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-gray-200 pb-2">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
}
