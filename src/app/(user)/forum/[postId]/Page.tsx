export default function UserForumPost({ params }: { params: { postId: string } }) {
  return (
    <div>
      <h1>User Forum Post: {params.postId}</h1>
    </div>
  );
}
