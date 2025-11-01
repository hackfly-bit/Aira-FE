'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { menuFormSchema, type MenuFormData } from '@/lib/validations/menu';
import { MENU_TARGETS, MENU_ICON_OPTIONS } from '@/lib/types/menu';
import type { Menu } from '@/lib/types/menu';

interface MenuFormProps {
  menu?: Menu;
  parentMenus?: Menu[];
  permissions?: string[];
  isLoading?: boolean;
  onSubmit: (data: MenuFormData) => Promise<void> | void;
  onCancel: () => void;
}

export function MenuForm({
  menu,
  parentMenus = [],
  permissions = [],
  isLoading = false,
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [open, setOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: menu?.name || '',
      display_name: menu?.display_name || '',
      url: menu?.url || '',
      icon: menu?.icon || '',
      description: menu?.description || '',
      parent_id: menu?.parent_id || undefined,
      sort_order: menu?.sort_order || 0,
      is_active: menu?.is_active ?? true,
      target: menu?.target || '_self',
      permission: menu?.permission || '',
    },
  });

  const watchName = form.watch('name');

  // Auto-generate display name from name
  useEffect(() => {
    if (!menu && watchName) {
      const displayName = watchName
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      form.setValue('display_name', displayName);
    }
  }, [watchName, menu, form]);

  const handleSubmit = (data: MenuFormData) => {
    onSubmit(data);
  };

  const selectedParent = parentMenus.find(p => p.id === form.watch('parent_id'));
  const selectedIcon = form.watch('icon');
  const selectedPermission = form.watch('permission');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., user-management"
                    {...field}
                    disabled={isLoading || !!menu}
                  />
                </FormControl>
                <FormDescription>
                  Unique identifier for the menu (kebab-case recommended)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Display Name */}
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., User Management"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Human-readable name shown in the menu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* URL */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., /users or https://example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Internal path or external URL
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Icon */}
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Icon</FormLabel>
                <Popover open={iconOpen} onOpenChange={setIconOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm">{field.value}</span>
                          </div>
                        ) : (
                          "Select icon..."
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search icons..." />
                      <CommandEmpty>No icon found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        <CommandItem
                          value=""
                          onSelect={() => {
                            form.setValue("icon", "");
                            setIconOpen(false);
                          }}
                        >
                          <span className="text-muted-foreground">No icon</span>
                        </CommandItem>
                        {MENU_ICON_OPTIONS.map((icon) => (
                          <CommandItem
                            value={icon.value}
                            key={icon.value}
                            onSelect={() => {
                              form.setValue("icon", icon.value);
                              setIconOpen(false);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm">{icon.value}</span>
                              <span className="text-muted-foreground">-</span>
                              <span>{icon.label}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Lucide React icon name (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of this menu item..."
                  className="resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Optional description for documentation purposes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent Menu */}
          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Parent Menu</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {selectedParent ? (
                          <div className="flex items-center space-x-2">
                            <span>{selectedParent.display_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {selectedParent.name}
                            </Badge>
                          </div>
                        ) : (
                          "Select parent menu..."
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search parent menus..." />
                      <CommandEmpty>No parent menu found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        <CommandItem
                          value=""
                          onSelect={() => {
                            form.setValue("parent_id", undefined);
                            setOpen(false);
                          }}
                        >
                          <span className="text-muted-foreground">No parent (Root menu)</span>
                        </CommandItem>
                        {parentMenus
                          .filter(p => p.id !== menu?.id) // Prevent self-parent
                          .map((parent) => (
                            <CommandItem
                              value={parent.display_name}
                              key={parent.id}
                              onSelect={() => {
                                form.setValue("parent_id", parent.id);
                                setOpen(false);
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <span>{parent.display_name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {parent.name}
                                </Badge>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Leave empty for root level menu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sort Order */}
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target */}
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MENU_TARGETS.map((target) => (
                      <SelectItem key={target.value} value={target.value}>
                        <div className="flex items-center space-x-2">
                          <span>{target.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {target.value}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How the link should open
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permission */}
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Permission</FormLabel>
                <Popover open={permissionOpen} onOpenChange={setPermissionOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {field.value ? (
                          <Badge variant="outline">{field.value}</Badge>
                        ) : (
                          "Select permission..."
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search permissions..." />
                      <CommandEmpty>No permission found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        <CommandItem
                          value=""
                          onSelect={() => {
                            form.setValue("permission", "");
                            setPermissionOpen(false);
                          }}
                        >
                          <span className="text-muted-foreground">No permission required</span>
                        </CommandItem>
                        {permissions.map((permission) => (
                          <CommandItem
                            value={permission}
                            key={permission}
                            onSelect={() => {
                              form.setValue("permission", permission);
                              setPermissionOpen(false);
                            }}
                          >
                            <Badge variant="outline">{permission}</Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Required permission to access this menu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Active Status */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Whether this menu item should be visible and accessible
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-2 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {menu ? 'Update Menu' : 'Create Menu'}
          </Button>
        </div>
      </form>
    </Form>
  );
}