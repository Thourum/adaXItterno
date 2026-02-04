"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { KeyIcon, PlusIcon } from "lucide-react";
import type { DigitalAccount, TrustedContact, AccountCategory } from "@repo/database";
import { AccountFormDialog } from "../../components/account-form-dialog";
import { AccountCard } from "../../components/account-card";

type AccountWithAccess = DigitalAccount & {
  accessList: { contact: TrustedContact }[];
};

type CategoryAccountsListProps = {
  accounts: AccountWithAccess[];
  contacts: TrustedContact[];
  category: AccountCategory;
  categoryTitle: string;
  categoryDescription: string;
};

export function CategoryAccountsList({
  accounts,
  contacts,
  category,
  categoryTitle,
  categoryDescription,
}: CategoryAccountsListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{categoryTitle}</h2>
          <p className="text-sm text-muted-foreground">{categoryDescription}</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <KeyIcon className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              No {categoryTitle.toLowerCase()} accounts yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first {categoryTitle.toLowerCase()} account
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              contacts={contacts}
            />
          ))}
        </div>
      )}

      <AccountFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        contacts={contacts}
        defaultCategory={category}
      />
    </>
  );
}
