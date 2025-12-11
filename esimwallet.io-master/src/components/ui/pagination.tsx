'use client';

import React, { useMemo } from 'react';

import { generatePageNumbers } from '@/lib/utils';

import {
  Pagination as UISPagination,
  PaginationContent as UISPaginationContent,
  PaginationItem as UISPaginationItem,
  PaginationLink as UISPaginationLink,
  PaginationNext as UISPaginationNext,
  PaginationPrevious as UISPaginationPrevious,
} from '@/components/ui.shadcn/pagination';

interface PaginationProps {
  page: number;
  totalPages: number;
  pageRange?: number;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, pageRange = 5 }) => {
  const pageNumbers = useMemo(() => generatePageNumbers(page, totalPages, pageRange), [page, totalPages, pageRange]);

  return (
    <UISPagination>
      <UISPaginationContent>
        {page > 1 && <UISPaginationPrevious href={`?page=${page - 1}`} />}
        {pageNumbers.map((item, index) => (
          <UISPaginationItem key={index}>
            {item === '...' ? (
              <span>...</span>
            ) : (
              <UISPaginationLink href={`?page=${item}`} isActive={page === item}>
                {item}
              </UISPaginationLink>
            )}
          </UISPaginationItem>
        ))}
        {page < totalPages && <UISPaginationNext href={`?page=${page + 1}`} />}
      </UISPaginationContent>
    </UISPagination>
  );
};
