/**
 * Return functions for calculating pagination and handling pagination click.
 *
 * @param {Object} paginationOptions
 * @param {number} paginationOptions.totalPages - Required. Total number of pages.
 * @param {number} [paginationOptions.maxPagesShown] - Maximum number of pages to show. Default is 7.
 * @param {Object} [paginationOptions.ellipsisOptions] - Object containing ellipsis options.
 * @param {boolean} [paginationOptions.ellipsisOptions.enableEllipsis = true] - Enable ellipsis. Default is true.
 * @param {boolean} [paginationOptions.ellipsisOptions.ellipsisCountsAsPage = false] - Whether ellipsis count as a page for max pages shown Default is true.
 * @param {boolean} [paginationOptions.ellipsisOptions.showEllipsisIfOnlyOnePage = true] - Show ellipsis if only one page difference. Default is true.
 * @param {boolean} [paginationOptions.ellipsisOptions.enableEllipsisClick = true] - Enable ellipsis click, will jump to halfway between current and start/end page. Default is true.
 * @param {boolean} [paginationOptions.ellipsisOptions.enableFirstLast = true] - Enable forcing first and last pagination item to be first and last page. Default is true.
 */
function usePagination(paginationOptions) {
  let totalPages = Math.max(paginationOptions.totalPages, 1);
  let lastPage = totalPages - 1;

  const maxPagesShown = paginationOptions?.maxPagesShown ?? 7;
  const middleIndex = Math.floor(maxPagesShown / 2);

  const enableEllipsis =
    paginationOptions?.ellipsisOptions?.enableEllipsis ?? true;
  const ellipsisCountsAsPage =
    paginationOptions?.ellipsisOptions?.ellipsisCountsAsPage ?? true;
  const showEllipsisIfOnlyOnePage =
    paginationOptions?.ellipsisOptions?.showEllipsisIfOnlyOnePage ?? true;
  const enableEllipsisClick =
    paginationOptions?.ellipsisOptions?.enableEllipsisClick ?? true;
  const enableFirstLast =
    paginationOptions?.ellipsisOptions?.enableFirstLast ?? true;

  /**
   * Update the total pages and last page.
   * @param {number} newTotalPages - The total number of pages.
   */
  function updateTotalPages(newTotalPages) {
    totalPages = Math.max(newTotalPages, 1);
    lastPage = totalPages - 1;
  }

  /**
   * Calculate the pages to show based on the current page.
   *
   * @param {number} pageIndex - The current page.
   * @returns {number[]} - The pages to show.
   */
  function calculatePages(pageIndex) {
    let pages = [];
    const currentPage = pageIndex;
    // Update pages array based on current page
    if (currentPage < middleIndex) {
      // Current page within first N pages
      pages = Array.from(
        { length: Math.min(maxPagesShown, totalPages) },
        (_, i) => i
      );
    } else if (currentPage > lastPage - middleIndex) {
      // Current page within last N pages
      pages = Array.from(
        { length: Math.min(maxPagesShown, totalPages) },
        (_, i) => lastPage - i
      ).sort((a, b) => a - b);
    } else {
      // Current page within middle N pages
      pages = Array.from(
        { length: Math.min(maxPagesShown, totalPages) },
        (_, i) => currentPage - middleIndex + i
      );
    }

    // Ellipsis Feature
    if (enableEllipsis) {
      const middlePage = pages[Math.floor(pages.length / 2)];
      // Middle page after first N pages. Show front ellipsis.
      if (middlePage - middleIndex > 0) {
        // Ellispsis counts as a page
        if (ellipsisCountsAsPage) {
          pages[enableFirstLast ? 1 : 0] = "...";
        }
        // Ellispsis does not count as a page
        else {
          // Should show page number if only one page
          const ellipsisValue =
            showEllipsisIfOnlyOnePage && middlePage - middleIndex === 1
              ? pages[1] - 1
              : "...";
          if (enableFirstLast) {
            pages = [pages[0], ellipsisValue, ...pages.slice(1, pages.length)];
          } else {
            pages = [ellipsisValue, ...pages];
          }
        }
      }
      // Middle page before last N pages. Show back ellipsis.
      if (middlePage + middleIndex < lastPage) {
        // Ellispsis counts as a page
        if (ellipsisCountsAsPage) {
          pages[pages.length - (enableFirstLast ? 2 : 1)] = "...";
        }
        // Ellispsis does not count as a page
        else {
          // Should show page number if only one page
          const ellipsisValue =
            showEllipsisIfOnlyOnePage &&
            middlePage + middleIndex === lastPage - 1
              ? pages[pages.length - 2] + 1
              : "...";
          if (enableFirstLast) {
            pages = [
              ...pages.slice(0, pages.length - 1),
              ellipsisValue,
              pages[pages.length - 1],
            ];
          } else {
            pages = [...pages, ellipsisValue];
          }
        }
      }
    }

    // First Last Feature
    if (enableFirstLast) {
      if (pages[0] !== 0) {
        pages[0] = 0;
      }
      if (pages[pages.length - 1] !== lastPage) {
        pages[pages.length - 1] = lastPage;
      }
    }

    return pages;
  }

  /**
   * Calculate the page to navigate to based on the current page and the clicked page.
   *
   * @param {number} currentPage - The current page.
   * @param {number} clickedPage - The page to navigate to.
   * @param {number} buttonIndex - The index of the button clicked.
   * @returns {number} - The page to navigate to.
   */
  function calculatePageClick(currentPage, clickedPage, buttonIndex) {
    if (typeof clickedPage === "number") {
      return clickedPage;
    }
    // Ellipsis Click
    else if (enableEllipsisClick) {
      if (buttonIndex < middleIndex) {
        return Math.floor(currentPage / 2);
      } else {
        return Math.ceil((currentPage + lastPage) / 2);
      }
    }
  }

  return { calculatePages, calculatePageClick, updateTotalPages };
}

export { usePagination };
