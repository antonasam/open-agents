"use client";

import useSWR from "swr";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { fetcherNoStore } from "@/lib/swr";

export function ProfileSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Your profile information is synced from Vercel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="grid gap-4 pt-4">
          <div className="grid gap-2">
            <Label>Username</Label>
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="grid gap-2">
            <Label>Name</Label>
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface GitHubUserProfile {
  login: string;
  avatar_url: string;
}

function getInitials(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "?";
}

export function ProfileSection() {
  const { session, loading, hasGitHub } = useSession();
  const { data: githubUser } = useSWR<GitHubUserProfile>(
    hasGitHub ? "/api/github/user" : null,
    fetcherNoStore,
  );

  if (loading) {
    return <ProfileSectionSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  const avatarSrc = githubUser?.avatar_url || session.user.avatar;
  const displayName = session.user.name ?? githubUser?.login ?? session.user.username;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Your profile information is synced from Vercel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {avatarSrc ? <AvatarImage src={avatarSrc} alt={session.user.username} /> : null}
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              @{session.user.username}
            </p>
          </div>
        </div>

        <div className="grid gap-4 pt-4">
          <div className="grid gap-2">
            <Label>Username</Label>
            <p className="text-sm text-muted-foreground">
              {session.user.username}
            </p>
          </div>

          {session.user.email && (
            <div className="grid gap-2">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          )}

          {session.user.name && (
            <div className="grid gap-2">
              <Label>Name</Label>
              <p className="text-sm text-muted-foreground">
                {session.user.name}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
