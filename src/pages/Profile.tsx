import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>
        <div className="text-sm text-muted-foreground">User ID</div>
        <div className="font-mono break-all mb-2">{user?.id}</div>
        <div className="text-sm text-muted-foreground">Email</div>
        <div className="mb-4">{user?.email}</div>
        <Button className="w-full" onClick={() => logout()}>Logout</Button>
      </div>
    </div>
  );
};

export default Profile;
