import Image from "next/image";
import loaderdark from '@/assets/loaderdark.gif'
import loaderlight  from '@/assets/loaderlight.gif'


const LoadingPage = () => {
    return  <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
    }}>
      <Image 
  src={loaderlight} height={150} width={150} 
  className="dark:hidden" 
  alt="Loading..." 
/>
<Image
  src={loaderdark} height={150} width={150} 
  className="hidden dark:block" 
  alt="Loading..."  
/>

        
    </div>;
}
 
export default LoadingPage;