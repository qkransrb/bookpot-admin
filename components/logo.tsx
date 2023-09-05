import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="px-3">
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={83}
          height={32}
          className="object-contain"
        />
      </Link>
    </div>
  );
};

export default Logo;
