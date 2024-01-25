interface SingleValueProps {
  label: string;
  value: string;
}

export default function SingleValue({ label, value }: SingleValueProps) {
  return (
    <div>
      {label && (
        <span className="font-light subpixel-antialiased">{label}: </span>
      )}
      <span>{value || '-'}</span>
    </div>
  );
}
