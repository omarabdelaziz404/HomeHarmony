import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' className='flex-start ml-4'>
            <Image
              src='/images/logo.svg'
              alt='Image Search AI Powered'
              height={48}
              width={48}
              priority={true}
            />
            <span className='hidden lg:block font-bold text-2xl ml-3'>
              AI Powered Image Search 
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;