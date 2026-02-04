"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@repo/design-system/components/ui/radio-group";
import { createContact } from "@/app/actions/contacts/create";
import { ArrowLeftIcon, Loader2Icon, UserPlusIcon } from "lucide-react";
import type { RelationshipType, ContactRole } from "@repo/database";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  relationship: z.enum(["FAMILY", "FRIEND", "COWORKER", "LEGAL", "OTHER"]),
  role: z.enum(["EXECUTOR", "RECIPIENT"]),
});

type FormValues = z.infer<typeof formSchema>;

const relationships = [
  { value: "FAMILY", label: "Family" },
  { value: "FRIEND", label: "Friend" },
  { value: "COWORKER", label: "Coworker" },
  { value: "LEGAL", label: "Legal Representative" },
  { value: "OTHER", label: "Other" },
];

type ContactsFormProps = {
  onNext: () => void;
  onBack: () => void;
  hasContacts: boolean;
};

export function ContactsForm({ onNext, onBack, hasContacts }: ContactsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      relationship: "FAMILY",
      role: "EXECUTOR",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const result = await createContact({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        relationship: values.relationship as RelationshipType,
        role: values.role as ContactRole,
      });

      if ("error" in result) {
        console.error(result.error);
        return;
      }

      onNext();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  if (hasContacts) {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-lg bg-muted p-6">
          <UserPlusIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            You already have trusted contacts
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You can add more contacts later from the Trusted Contacts page.
          </p>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={onNext}>Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          <strong>Important:</strong> Trusted contacts are people who will have
          access to your digital legacy. Choose someone you trust completely.
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (Optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 234 567 8900" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
                    <FormControl>
                      <RadioGroupItem value="EXECUTOR" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium">Executor</FormLabel>
                      <FormDescription>
                        Full access to your digital legacy, including all
                        accounts, documents, and media (unless restricted).
                      </FormDescription>
                    </div>
                  </FormItem>
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-4">
                    <FormControl>
                      <RadioGroupItem value="RECIPIENT" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="font-medium">Recipient</FormLabel>
                      <FormDescription>
                        Only has access to items you explicitly share with them.
                      </FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Add Contact & Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
