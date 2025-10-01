import React from 'react';

const Collection = () => {

    const item = [
        {id: 1, img:"https://www.mariorusso.az/business.jpg?height=600&width=400"},
        {id: 2, img:"https://www.mariorusso.az/tuxedo.jpg?height=600&width=400"},
        {id: 3, img:" https://www.mariorusso.az/tuxedo.jpg?height=600&width=400"},
        {id: 4, img:"https://www.mariorusso.az/coat.jpeg?height=600&width=400"},
        {id: 5, img:"https://www.mariorusso.az/casual.jpg?height=600&width=400"},
        {id: 6, img:"https://www.mariorusso.az/accessories.jpg?height=600&width=400"}
    ]
  return (
    <div className='max-w-[1400px]'>
         <span className="block text-[24px] text-center font-semibold uppercase tracking-wide font-sans mb-[40px] bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
       Bizim Kolleksiyalarımız
      </span>
      <div className='flex flex-wrap w-[1400px] gap-[30px]'>
        {item.map((item,index) => (
            <img src={item.img} key={index} alt="" className='w-[446px] h-[495px]' />
        ))}
      </div>
    </div>
  );
}

export default Collection;
