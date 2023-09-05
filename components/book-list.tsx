import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Author, Ebook } from "../types";
import UpdateBook from "./update-book";
// import UpdateBook from "./update-book";

interface Props {
  ebooks: Ebook[];
  authors: Author[];
}

const BookList = ({ ebooks, authors }: Props) => {
  return (
    <Table>
      <TableHeader className="bg-[#EEF2FE]">
        <TableRow>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">#</TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            썸네일
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            제목
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            설명
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            소개
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            등록일
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            정상가
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            작가
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            체험판
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            전자책 PDF
          </TableHead>
          <TableHead className="text-right text-[#1C1C1C] text-sm font-bold">
            기타
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ebooks.map((ebook, index) => (
          <TableRow key={ebook.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              {ebook.thumbnailUrl ? (
                <Image
                  src={ebook.thumbnailUrl}
                  alt="Thumbnail"
                  width={40}
                  height={40}
                  priority
                  className="h-[40px] w-[40px] rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-main-dark/20" />
              )}
            </TableCell>
            <TableCell className="max-w-[100px] truncate">
              {ebook.title}
            </TableCell>
            <TableCell className="max-w-[180px] truncate">
              {ebook.intro}
            </TableCell>
            <TableCell>
              {ebook.descriptionUrl ? (
                <Image
                  src={ebook.descriptionUrl}
                  alt="Description"
                  width={40}
                  height={40}
                  priority
                  className="h-[40px] w-[40px] rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-main-dark/20" />
              )}
            </TableCell>
            <TableCell>{ebook.createdAt}</TableCell>
            <TableCell>{ebook.price}</TableCell>
            <TableCell>{ebook.author.name}</TableCell>
            <TableCell>
              <a
                href={ebook.previewUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Link
              </a>
            </TableCell>
            <TableCell>
              <a
                href={ebook.pdfUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Link
              </a>
            </TableCell>
            <TableCell className="text-right">
              <UpdateBook authors={authors} ebook={ebook} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookList;
