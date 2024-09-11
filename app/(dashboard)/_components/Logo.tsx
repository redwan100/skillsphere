import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <Image src={"/logo.svg"} alt="logo" width={120} height={120} />
    </div>
  );
};

export default Logo;
