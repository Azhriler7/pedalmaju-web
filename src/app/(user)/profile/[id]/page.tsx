export default function UserProfile({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>User Profile: {params.id}</h1>
    </div>
  );
}
