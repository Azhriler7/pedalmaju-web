export default function UserMaterialDetail({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>User Material Detail: {params.id}</h1>
    </div>
  );
}
