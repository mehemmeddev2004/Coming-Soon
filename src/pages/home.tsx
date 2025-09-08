import React from 'react';
import Header from '../components/Header'; // Header komponentinin path-i
import Footer from '../components/Footer'; // Footer komponentinin path-i
import Kampaniya from '../components/Kampaniya';
import NewIn from '../components/NewIn';
import NewSeason from '../components/NewSeason';
import Pay from '../components/Pay';

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
   

      <main className='flex flex-col mt-[30px] gap-y-[30px] mb-[50px] justify-center items-center flex-1'>
        <Kampaniya />
        <NewIn />
        <NewSeason />
        <Pay />
      </main>

   

    </div>
  );
}

export default Page;
