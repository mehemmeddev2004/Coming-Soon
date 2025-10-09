import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Clothes from "@/components/main/Clothes";

import Kampaniya from "@/components/main/Kampaniya";

import NewIn from "@/components/main/NewIn";

import Sneakers from "@/components/main/Sneakers";


export default function Home() {
  return (
     <div className="flex flex-col min-h-screen">
   

      <main className='flex flex-col  gap-y-[30px] mb-[50px] justify-center items-center flex-1'>
        <Kampaniya />
        <NewIn />
        <Sneakers/>

        <Clothes/>
      </main>

   

    </div>
  );
}
