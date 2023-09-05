import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import api from "../lib/api";
import { Author } from "../types";
import AuthorList from "../components/author-list";
import AddAuthor from "../components/add-author";

interface Props {
  authors: Author[];
}

const Authors = ({ authors = [] }: Props) => {
  return (
    <section className="h-full w-full flex flex-col gap-y-8">
      <div className="h-10 w-full flex items-center justify-between">
        <h1 className="text-2xl text-[#1C1C1C] font-bold">작가 관리</h1>
        <AddAuthor />
      </div>
      <div>
        <AuthorList authors={authors} />
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

  const response = await api.get("/api/v1/authors", {
    headers: {
      Cookie: req.headers.cookie,
    },
  });

  return {
    props: {
      authors: response.data,
    },
  };
};

export default Authors;
