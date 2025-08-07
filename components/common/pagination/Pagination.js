// components/common/pagination/Pagination.js
import styles from "./Pagination.module.css";

const Pagination = ({ page, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const createPageList = () => {
    const pages = [];

    const showLeftEllipsis = page > 4;
    const showRightEllipsis = page < totalPages - 3;
    pages.push(1);

    if (showLeftEllipsis) {
      pages.push("left-ellipsis");
    }

    const startPage = Math.max(2, page - 2);
    const endPage = Math.min(totalPages - 1, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push("right-ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageList = createPageList();

  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={handlePrev}
        disabled={page === 1 || totalPages === 0}
      >
        {"<"}
      </button>

      {pageList.map((p, idx) => {
        if (p === "left-ellipsis" || p === "right-ellipsis") {
          return (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              ...
            </span>
          );
        }

        return (
          <button
            key={`page-${p}`}
            className={`${styles.pageButton} ${
              p === page ? styles.active : ""
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        );
      })}

      <button
        className={styles.pageButton}
        onClick={handleNext}
        disabled={page >= totalPages || totalPages === 0}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
