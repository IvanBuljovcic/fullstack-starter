const HTTP_METHODS = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];
