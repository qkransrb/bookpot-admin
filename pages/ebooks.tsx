import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next";

import api from "../lib/api";
import { Author, Ebook } from "../types";
import AddBook from "../components/add-book";
import BookList from "../components/book-list";

interface Props {
  authors: Author[];
  ebooks: Ebook[];
}

const Ebooks = ({ authors, ebooks }: Props) => {
  return (
    <section className="h-full w-full flex flex-col gap-y-8">
      <div className="h-10 w-full flex items-center justify-between">
        <h1 className="text-2xl text-[#1C1C1C] font-bold">전자책 관리</h1>
        <AddBook authors={authors} />
      </div>
      <div>
        <BookList authors={authors} ebooks={ebooks} />
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const accessToken = getCookie("accessToken", { req, res });

  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  const [authors, ebooks] = await Promise.all([
    api.get("/api/v1/authors", {
      headers: {
        Cookie: req.headers.cookie,
      },
    }),
    api.get("/api/v1/ebooks", {
      headers: {
        Cookie: req.headers.cookie,
      },
    }),
  ]);

  return {
    props: {
      authors: authors.data,
      ebooks: ebooks.data,
    },
  };
};

export default Ebooks;
