export interface SessionCompany {

  id: number;

  name: string;

  logoUrl?: string | null;

}

export interface SessionBranch {

  id: number;

  name: string;

}

export interface SessionUser {

  id: number;

  name: string;

  email: string;

  role: string;

  theme?: string | null;

}

export interface SessionData {

  company: SessionCompany;

  branch?: SessionBranch | null;

  user: SessionUser;

}