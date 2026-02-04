"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/design-system/components/ui/form";
import { Input } from "@repo/design-system/components/ui/input";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/design-system/components/ui/radio-group";
import { createAccount } from "@/app/actions/accounts/create";
import { updateAccount } from "@/app/actions/accounts/update";
import { Loader2Icon } from "lucide-react";
import type { DigitalAccount, TrustedContact, AccountCategory, ActionOnDeath } from "@repo/database";

const formSchema = z.object({
  platformName: z.string().min(1, "Platform name is required"),
  category: z.enum([
    "SOCIAL_MEDIA",
    "EMAIL_COMMUNICATION",
    "FINANCIAL",
    "CRYPTO",
    "SUBSCRIPTIONS",
    "OTHER",
  ]),
  username: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  actionOnDeath: z.enum(["DELETE", "TRANSFER", "MEMORIALIZE"]),
  transferToId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categoryOptions = [
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "EMAIL_COMMUNICATION", label: "Email & Communication" },
  { value: "FINANCIAL", label: "Financial" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "SUBSCRIPTIONS", label: "Subscriptions" },
  { value: "OTHER", label: "Other" },
];

type AccountFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: TrustedContact[];
  account?: DigitalAccount | null;
  defaultCategory?: AccountCategory;
};

export function AccountFormDialog({
  open,
  onOpenChange,
  contacts,
  account,
  defaultCategory,
}: AccountFormDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!account;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformName: "",
      category: defaultCategory || "SOCIAL_MEDIA",
      username: "",
      email: "",
      actionOnDeath: "DELETE",
      transferToId: "",
      notes: "",
    },
  });

  const actionOnDeath = form.watch("actionOnDeath");

  useEffect(() => {
    if (account) {
      form.reset({
        platformName: account.platformName,
        category: account.category,
        username: account.username || "",
        email: account.email || "",
        actionOnDeath: account.actionOnDeath,
        transferToId: account.transferToId || "",
        notes: account.notes || "",
      });
    } else {
      form.reset({
        platformName: "",
        category: defaultCategory || "SOCIAL_MEDIA",
        username: "",
        email: "",
        actionOnDeath: "DELETE",
        transferToId: "",
        notes: "",
      });
    }
  }, [account, defaultCategory, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && account) {
        const result = await updateAccount({
          id: account.id,
          platformName: values.platformName,
          category: values.category as AccountCategory,
          username: values.username || undefined,
          email: values.email || undefined,
          actionOnDeath: values.actionOnDeath as ActionOnDeath,
          transferToId: values.actionOnDeath === "TRANSFER" ? values.transferToId : null,
          notes: values.notes || undefined,
        });

        if ("error" in result) {
          console.error(result.error);
          return;
        }
      } else {
        const result = await createAccount({
          platformName: values.platformName,
          category: values.category as AccountCategory,
          username: values.username || undefined,
          email: values.email || undefined,
          actionOnDeath: values.actionOnDeath as ActionOnDeath,
          transferToId: values.actionOnDeath === "TRANSFER" ? values.transferToId : undefined,
          notes: values.notes || undefined,
        });

        if ("error" in result) {
          console.error(result.error);
          return;
        }
      }

      onOpenChange(false);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Account" : "Add Digital Account"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the account information and instructions."
              : "Add a digital account and specify what should happen to it."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platformName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Facebook, Gmail, Chase Bank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="actionOnDeath"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Action on Death</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3">
                        <FormControl>
                          <RadioGroupItem value="DELETE" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">Delete</FormLabel>
                          <FormDescription className="text-xs">
                            Request deletion of this account
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3">
                        <FormControl>
                          <RadioGroupItem value="TRANSFER" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">Transfer</FormLabel>
                          <FormDescription className="text-xs">
                            Transfer ownership to a trusted contact
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3">
                        <FormControl>
                          <RadioGroupItem value="MEMORIALIZE" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">Memorialize</FormLabel>
                          <FormDescription className="text-xs">
                            Keep as a memorial (if supported by platform)
                          </FormDescription>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {actionOnDeath === "TRANSFER" && (
              <FormField
                control={form.control}
                name="transferToId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transfer To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select who should receive this account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Recovery codes in Documents folder"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any additional instructions or information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Save Changes" : "Add Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
