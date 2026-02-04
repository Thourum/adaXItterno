import { auth } from "@repo/auth/server";
import { database } from "@repo/database";
import { redirect } from "next/navigation";
import { Header } from "../components/header";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/design-system/components/ui/card";
import { Badge } from "@repo/design-system/components/ui/badge";
import {
  FileTextIcon,
  GlobeIcon,
  ImageIcon,
  UserIcon,
} from "lucide-react";

type SearchPageProperties = {
  searchParams: Promise<{
    q: string;
  }>;
};

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!q) {
    redirect("/");
  }

  const profile = await database.userProfile.findUnique({
    where: { clerkUserId: userId },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  // Search across accounts, documents, contacts, and media folders
  const [accounts, documents, contacts, folders] = await Promise.all([
    database.digitalAccount.findMany({
      where: {
        userId: profile.id,
        OR: [
          { platformName: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
          { notes: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    database.document.findMany({
      where: {
        userId: profile.id,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    database.trustedContact.findMany({
      where: {
        userId: profile.id,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    database.mediaFolder.findMany({
      where: {
        userId: profile.id,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
  ]);

  const totalResults = accounts.length + documents.length + contacts.length + folders.length;

  return (
    <>
      <Header page="Search" pages={["Home", "Search"]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div>
          <h2 className="text-lg font-semibold">
            Search results for &quot;{q}&quot;
          </h2>
          <p className="text-sm text-muted-foreground">
            Found {totalResults} results
          </p>
        </div>

        {totalResults === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No results found for &quot;{q}&quot;
          </div>
        ) : (
          <div className="space-y-6">
            {/* Accounts */}
            {accounts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Digital Accounts ({accounts.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((account) => (
                    <Link key={account.id} href="/accounts">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <GlobeIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-sm">
                                {account.platformName}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {account.username || account.email || "No username"}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Documents ({documents.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {documents.map((doc) => (
                    <Link key={doc.id} href="/documents">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-sm">{doc.name}</CardTitle>
                              {doc.isWill && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  Will
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts */}
            {contacts.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Trusted Contacts ({contacts.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact) => (
                    <Link key={contact.id} href="/contacts">
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-sm">
                                {contact.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {contact.email || contact.phone || contact.relationship}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Media Folders */}
            {folders.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Media Folders ({folders.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {folders.map((folder) => (
                    <Link key={folder.id} href={`/media/${folder.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <CardTitle className="text-sm">
                                {folder.name}
                              </CardTitle>
                              {folder.description && (
                                <CardDescription className="text-xs">
                                  {folder.description}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
