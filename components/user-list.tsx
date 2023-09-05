import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { User } from "../types";

interface PageProps {
  users: User[];
}

const UserList: React.FC<PageProps> = ({ users }) => {
  return (
    <Table>
      <TableHeader className="bg-[#EEF2FE]">
        <TableRow>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">#</TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            닉네임
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            이메일
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            가입일
          </TableHead>
          <TableHead className="text-[#1C1C1C] text-sm font-bold">
            총 구매량
          </TableHead>
          <TableHead className="text-right text-[#1C1C1C] text-sm font-bold">
            총 구매 금액
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{user.nickName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.createdAt}</TableCell>
            <TableCell>20</TableCell>
            <TableCell className="text-right">250,000,000원</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
