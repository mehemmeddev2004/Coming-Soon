import Footer from "@/components/Footer";
import Header from "@/components/Header";
import About from "@/components/main/About";
import Collection from "@/components/main/Collection";
import Instagram from "@/components/main/Instagram";
import Kampaniya from "@/components/main/Kampaniya";
import Koynekler from "@/components/main/Koynekler";
import NewIn from "@/components/main/NewIn";
import NewSeason from "@/components/main/NewSeason";
import Sneakers from "@/components/main/Sneakers";


export default function Home() {
  return (
     <div className="flex flex-col min-h-screen">
   

      <main className='flex flex-col  gap-y-[30px] mb-[50px] justify-center items-center flex-1'>
        <Kampaniya />
        <NewIn />
        <NewSeason />
        <Sneakers/>
        <Koynekler/>
        <Collection/>
        <About/>
        <Instagram/>
      </main>

   

    </div>
  );
}
