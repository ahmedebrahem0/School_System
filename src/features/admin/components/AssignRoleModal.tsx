"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_ROLES, ROLE_META } from "@/constants/roles";
import { assignRoleSchema, type AssignRoleSchema } from "../schema/assign-role.schema";
import { useAssignRole } from "../hooks/useAssignRole";
import type { AdminUser } from "../types";

interface AssignRoleModalProps {
  user?: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignRoleModal({
  user,
  open,
  onOpenChange,
}: AssignRoleModalProps) {
  const { assign, isAssigning } = useAssignRole();
  const availableRoles = useMemo(
    () => ALL_ROLES.filter((role) => !(user?.roles ?? []).includes(role)),
    [user?.roles]
  );

  const form = useForm<AssignRoleSchema>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      userId: user?.id ?? "",
      role: availableRoles[0],
    },
  });

  useEffect(() => {
    form.reset({
      userId: user?.id ?? "",
      role: availableRoles[0],
    });
  }, [availableRoles, form, user?.id]);

  const onSubmit = async (values: AssignRoleSchema) => {
    await assign(values, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign role</DialogTitle>
          <DialogDescription>
            Give {user?.fullName || user?.userName || "this user"} access to the
            correct workspace tools.
          </DialogDescription>
        </DialogHeader>

        {availableRoles.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] text-zinc-600">
            This user already has every available role.
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel required>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isAssigning}
                      >
                        <SelectTrigger error={!!fieldState.error}>
                          <div className="flex items-center gap-2 text-zinc-400">
                            <ShieldCheck size={15} />
                            <SelectValue placeholder="Select role" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_META[role].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isAssigning}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isAssigning}
                  loadingText="Assigning..."
                >
                  Assign Role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
