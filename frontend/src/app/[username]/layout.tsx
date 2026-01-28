import Link from 'next/link';
import { Metadata } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || API_BASE_URL;

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;

  try {
    const response = await fetch(`${INTERNAL_API_URL}/api/users/${username}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'ユーザーが見つかりません | PicMe',
        description: 'お探しのユーザーは見つかりませんでした。',
      };
    }

    const json = await response.json();
    const data = json.data;
    const profile = data.profile;

    const title = `${profile.displayName} (@${username}) | PicMe`;
    const description = profile.bio
      ? profile.bio.substring(0, 160)
      : `${profile.displayName}さんのポートフォリオページです。`;

    return {
      title,
      description,
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `https://picme.com/${username}`,
        siteName: 'PicMe',
        images: profile.avatarUrl
          ? [
              {
                url: profile.avatarUrl,
                width: 400,
                height: 400,
                alt: profile.displayName,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: profile.avatarUrl ? [profile.avatarUrl] : [],
      },
    };
  } catch (error: any) {
    console.error(`[Metadata Error] Failed to fetch data from ${API_BASE_URL}/api/users/${username}`, {
      message: error.message,
      cause: error.cause,
      url: `${API_BASE_URL}/api/users/${username}`
    });
    return {
      title: 'PicMe',
      description: 'クリエイターのためのポートフォリオサービス',
    };
  }
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-slate-500">
        <p>
          Powered by <Link href="/" className="font-semibold text-slate-900 hover:underline">PicMe</Link>
        </p>
      </footer>
    </div>
  );
}
