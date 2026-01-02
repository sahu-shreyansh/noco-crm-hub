// NocoDB API Helper with Pagination Support
// Handles the default 100-row limit by fetching all pages

interface NocoDBResponse<T> {
  list: T[];
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

interface FetchOptions {
  baseUrl: string;
  tableId: string;
  apiToken: string;
  where?: string;
  sort?: string;
  fields?: string[];
}

const PAGE_SIZE = 100;

export async function fetchAllPages<T>(options: FetchOptions): Promise<T[]> {
  const { baseUrl, tableId, apiToken, where, sort, fields } = options;
  
  let allData: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: PAGE_SIZE.toString(),
    });

    if (where) params.append('where', where);
    if (sort) params.append('sort', sort);
    if (fields?.length) params.append('fields', fields.join(','));

    const response = await fetch(
      `${baseUrl}/api/v2/tables/${tableId}/records?${params.toString()}`,
      {
        headers: {
          'xc-token': apiToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NocoDB fetch failed: ${response.statusText}`);
    }

    const data: NocoDBResponse<T> = await response.json();
    allData = [...allData, ...data.list];
    
    // Check if we need to fetch more pages
    hasMore = data.list.length === PAGE_SIZE;
    page++;
  }

  return allData;
}

export async function fetchPaginatedData<T>(
  endpoint: string,
  apiToken: string
): Promise<T[]> {
  let allData: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${endpoint}${separator}page=${page}&pageSize=${PAGE_SIZE}`;

    const response = await fetch(url, {
      headers: {
        'xc-token': apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }

    const data: NocoDBResponse<T> = await response.json();
    allData = [...allData, ...data.list];
    
    hasMore = data.list.length === PAGE_SIZE;
    page++;
  }

  return allData;
}

// Helper to aggregate paginated results before computing analytics
export function ensureFullDataset<T>(
  data: T[],
  expectedMinimum?: number
): { isComplete: boolean; data: T[]; warning?: string } {
  const isComplete = !expectedMinimum || data.length >= expectedMinimum;
  
  return {
    isComplete,
    data,
    warning: !isComplete 
      ? `Dataset may be incomplete. Expected at least ${expectedMinimum} rows, got ${data.length}.`
      : undefined,
  };
}
