import Image from "next/image";

import { Author } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import UpdateAuthor from "./update-author";

interface Props {
  authors: Author[];
}

const AuthorList = ({ authors }: Props) => {
  return (
    <Table>
      <TableHeader className="bg-[#EEF2FE]">
        <TableRow>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">#</TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            썸네일
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            성함
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            이메일
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            소개
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            등록일
          </TableHead>
          <TableHead className="text-right text-[#1C1C1C] text-sm font-bold">
            기타
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {authors.map((author, index) => (
          <TableRow key={author.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <Image
                src={author.thumbnailUrl}
                alt="Thumbnail"
                width={40}
                height={40}
                priority
                className="h-[40px] w-[40px] rounded-full object-cover"
              />
            </TableCell>
            <TableCell>{author.name}</TableCell>
            <TableCell>{author.email}</TableCell>
            <TableCell>{author.description}</TableCell>
            <TableCell>{author.createdAt}</TableCell>
            <TableCell className="text-right">
              <UpdateAuthor author={author} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AuthorList;
