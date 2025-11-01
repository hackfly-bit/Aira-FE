'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Edit, Trash2, Copy, Move, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { Menu } from '@/lib/types/menu';

interface MenuTableProps {
  menus: Menu[];
  isLoading?: boolean;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  onDuplicate: (menu: Menu) => void;
  onMove: (menu: Menu) => void;
  onToggleStatus: (menu: Menu) => void;
  onViewChildren?: (menu: Menu) => void;
}

export function MenuTable({
  menus,
  isLoading = false,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  onToggleStatus,
  onViewChildren,
}: MenuTableProps) {
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);

  const handleSelectMenu = (menuId: number) => {
    setSelectedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMenus.length === menus.length) {
      setSelectedMenus([]);
    } else {
      setSelectedMenus(menus.map(menu => menu.id));
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const getTargetBadge = (target: string) => {
    const targetLabels = {
      '_self': 'Same Window',
      '_blank': 'New Window',
      '_parent': 'Parent Frame',
      '_top': 'Top Frame'
    };
    
    return (
      <Badge variant="outline">
        {targetLabels[target as keyof typeof targetLabels] || target}
      </Badge>
    );
  };

  const renderMenuHierarchy = (menu: Menu, level: number = 0) => {
    const indent = level * 20;
    
    return (
      <div key={menu.id} className="w-full">
        <TableRow className="hover:bg-muted/50">
          <TableCell className="w-12">
            <input
              type="checkbox"
              checked={selectedMenus.includes(menu.id)}
              onChange={() => handleSelectMenu(menu.id)}
              className="rounded border-gray-300"
            />
          </TableCell>
          <TableCell>
            <div style={{ paddingLeft: `${indent}px` }} className="flex items-center space-x-2">
              {level > 0 && <span className="text-muted-foreground">└─</span>}
              <div className="flex flex-col">
                <span className="font-medium">{menu.display_name}</span>
                <span className="text-sm text-muted-foreground">{menu.name}</span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <code className="text-sm bg-muted px-2 py-1 rounded">{menu.url}</code>
          </TableCell>
          <TableCell>
            {menu.icon && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{menu.icon}</span>
              </div>
            )}
          </TableCell>
          <TableCell>
            {menu.parent ? (
              <span className="text-sm text-muted-foreground">{menu.parent.display_name}</span>
            ) : (
              <span className="text-sm text-muted-foreground">Root</span>
            )}
          </TableCell>
          <TableCell className="text-center">{menu.sort_order}</TableCell>
          <TableCell>{getStatusBadge(menu.is_active)}</TableCell>
          <TableCell>{getTargetBadge(menu.target)}</TableCell>
          <TableCell>
            {menu.permission && (
              <Badge variant="outline" className="text-xs">
                {menu.permission}
              </Badge>
            )}
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">
            {format(new Date(menu.created_at), 'dd/MM/yyyy HH:mm')}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(menu.url)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onEdit(menu)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onDuplicate(menu)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onMove(menu)}>
                  <Move className="mr-2 h-4 w-4" />
                  Move
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onToggleStatus(menu)}>
                  {menu.is_active ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                
                {menu.children && menu.children.length > 0 && onViewChildren && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewChildren(menu)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Children ({menu.children.length})
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => onDelete(menu)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        
        {/* Render children recursively */}
        {menu.children && menu.children.map(child => 
          renderMenuHierarchy(child, level + 1)
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={false}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                No menus found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedMenus.length === menus.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map(menu => renderMenuHierarchy(menu))}
        </TableBody>
      </Table>
    </div>
  );
}