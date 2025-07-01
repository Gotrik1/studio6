import { UserProfilePage } from '@/views/user-profile';

export default function UserProfileRoute({ params }: { params: { id: string } }) {
    return <UserProfilePage userId={params.id} />;
}
