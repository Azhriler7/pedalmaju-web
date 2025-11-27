export default function AdminMaterialDetail({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Admin Material Detail: {params.id}</h1>
    </div>
  );
}
