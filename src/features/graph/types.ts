export type OSINTNodeType =
  | 'email'
  | 'domain'
  | 'ip'
  | 'person'
  | 'username'
  | 'phone'
  | 'generic';

export type OSINTRelationshipType =
  | 'associated_with'
  | 'related_to'
  | 'owns'
  | 'belongs_to'
  | 'communicates_with'
  | 'hosts'
  | 'resolves_to';

export interface OSINTMetadata {
  source?: string;
  verified?: boolean;
  registrar?: string;
  [key: string]: unknown;
}
