export interface VercelVerification {
  type: string;
  domain: string;
  reason?: string;
  instructions?: string;
}

export interface VercelDomainStatusResponse {
  name: string;
  apexName: string;
  configured: boolean;
  misconfigured: boolean;
  verification: VercelVerification[];
}
