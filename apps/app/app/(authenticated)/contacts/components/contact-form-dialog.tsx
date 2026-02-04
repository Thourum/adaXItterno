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
import { createContact } from "@/app/actions/contacts/create";
import { updateContact } from "@/app/actions/contacts/update";
import { Loader2Icon } from "lucide-react";
import type { TrustedContact, RelationshipType, ContactRole } from "@repo/database";

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

type ContactFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: TrustedContact | null;
};

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
}: ContactFormDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!contact;

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

  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name,
        email: contact.email || "",
        phone: contact.phone || "",
        relationship: contact.relationship,
        role: contact.role,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        relationship: "FAMILY",
        role: "EXECUTOR",
      });
    }
  }, [contact, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && contact) {
        const result = await updateContact({
          id: contact.id,
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
      } else {
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
      }

      onOpenChange(false);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Contact" : "Add Trusted Contact"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the contact's information and access level."
              : "Add someone you trust to manage your digital legacy."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        {...field}
                      />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
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
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3">
                        <FormControl>
                          <RadioGroupItem value="EXECUTOR" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">Executor</FormLabel>
                          <FormDescription className="text-xs">
                            Full access to everything unless restricted
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border p-3">
                        <FormControl>
                          <RadioGroupItem value="RECIPIENT" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">Recipient</FormLabel>
                          <FormDescription className="text-xs">
                            Only sees explicitly shared items
                          </FormDescription>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
                {isEditing ? "Save Changes" : "Add Contact"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
