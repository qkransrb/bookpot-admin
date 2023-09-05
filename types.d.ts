export interface CredentialsLoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nickName: string;
  loginType: string;
  username: string;
  socialType: string | null;
  createdAt: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  description: string;
  createdAt: string;
  thumbnailUrl: string;
}

export interface Ebook {
  id: number;
  title: string;
  price: number;
  intro: string;
  authorId: number;
  createdAt: string;
  thumbnailUrl: string;
  pdfUrl: string;
  previewUrl: string;
  descriptionUrl: string;
  author: Author;
}
