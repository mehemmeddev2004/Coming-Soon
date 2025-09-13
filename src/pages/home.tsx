import React from 'react';
import Header from '../components/Header'; // Header komponentinin path-i
import Footer from '../components/Footer'; // Footer komponentinin path-i
import Kampaniya from '../components/main/Kampaniya';
import NewIn from '../components/main/NewIn';
import NewSeason from '../components/main/NewSeason';
import Sneakers from '@/components/main/Sneakers';
import Koynekler from '@/components/main/Koynekler';


const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
   

      <main className='flex flex-col mt-[30px] gap-y-[30px] mb-[50px] justify-center items-center flex-1'>
        <Kampaniya />
        <NewIn />
        <NewSeason />
        <Sneakers/>
        <Koynekler/>

      </main>

   

    </div>
  );
}

export default Page;
