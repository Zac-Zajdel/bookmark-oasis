export default function DetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="mt-20 flex flex-col items-center space-y-10">
      Bookmark Details ID: {params.id}
    </div>
  );
}
