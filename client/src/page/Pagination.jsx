import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function MyPagination({ page, pages, onChange }) {
   if (pages <= 1) return null;

  return (
    <Pagination
      count={pages}
      page={page}
      onChange={(event, value) => onChange(value)}
      renderItem={(item) => (
        <PaginationItem
          slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
          {...item}
        />
      )}
    />
  );
}
