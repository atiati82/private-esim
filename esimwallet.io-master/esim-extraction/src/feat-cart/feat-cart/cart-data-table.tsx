'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { CircleMinusIcon, CirclePlusIcon } from 'lucide-react';

import { useAppDispatch } from '@/data-store/store-hooks';
import { urlForProduct } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { Button } from '@/components/ui.shadcn/form/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui.shadcn/table';
import { CurrencyFormatter } from '@/components/ui/currency-formatter';
import { addItemAction, CartItem, removeItemAction } from '@/feat-cart/cart.store';
import { fontSemibold, link, textAlignCenter } from '@/styles/typography.css';
import * as styles from './cart-data-table.css';

export const columns: ColumnDef<CartItem>[] = [
  {
    accessorKey: 'id',
    header: '',
    size: 10,
    minSize: 10,
    cell: ({ row }) => <div>{row.index + 1}.</div>,
  },
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => {
      const cartItem = row.original;
      return (
        <Link
          href={urlForProduct(cartItem.location, cartItem.productId)}
          className={cn(link, fontSemibold)}
        >
          {row.getValue('name')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'qty',
    size: 25,
    header: () => <div className={styles.headerQty}>Qty</div>,
    cell: ({ row }) => {
      const dispatch = useAppDispatch();
      const cartItem = row.original;
      const onCartAdd = (): unknown => dispatch(addItemAction(cartItem));
      const onCartRemove = (): unknown => dispatch(removeItemAction(cartItem.id));
      return (
        <>
          <Button onClick={onCartRemove} size="icon">
            <CircleMinusIcon />
          </Button>
          <span className={styles.qty}>{row.getValue('qty')}</span>
          <Button onClick={onCartAdd} size="icon">
            <CirclePlusIcon />
          </Button>
        </>
      );
    },
  },
  {
    accessorKey: 'amount',
    size: 22,
    header: () => <div className={styles.headerAmount}>Amount</div>,
    cell: ({ row }) => {
      const cartItem = row.original;
      const amount = cartItem.qty * cartItem.unitPrice;
      return <CurrencyFormatter className={styles.cellAmountFormatter} amount={amount} />;
    },
  },
];

interface CartTableProps {
  cartData: CartItem[];
}

export const CartDataTable: React.FC<CartTableProps> = ({ cartData }) => {
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: cartData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <Table variant="bordered" className={styles.cartDataTable}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className={'column-header-' + header.id}
                  style={{ width: header.id === 'name' ? 'auto' : header.getSize() + '%' }}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={'column-' + cell.column.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className={textAlignCenter}>
              Your cart is empty.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
