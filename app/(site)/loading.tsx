export default function Loading() {
  return (
    <div className="flex w-full min-h-[70vh] items-center justify-center">
      <div
        className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
