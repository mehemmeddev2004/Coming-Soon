import React from 'react';

const Instagram = () => {
  return (
    <div>
      <div>
        <div className='flex items-center flex-col'>
          <div className='flex items-center gap-[10px] mb-[20px]'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-instagram h-8 w-8 mr-3"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>

            <div className='flex flex-col gap-y-[10px]'>
              <h2 className='text-[2.25rem] font-[400] text-4xl text-center text-stone-900 tracking-wide'>
                @ETOR
              </h2>
              <span className='block w-[120px] h-[1px] bg-black'></span>
            </div>
          </div>

          <span className='text-lg text-stone-600 font-light text-center max-w-2xl mx-auto mb-8'>
            Follow our journey of craftsmanship and elegance. Get inspired by our latest creations, behind-the-scenes moments, and style insights.
          </span>

          <a
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 tracking-wide"
            href="https://www.instagram.com/etor.baku/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-instagram h-5 w-5 mr-2"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
            FOLLOW US ON INSTAGRAM
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-external-link h-4 w-4 ml-2"
            >
              <path d="M15 3h6v6"></path>
              <path d="M10 14 21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Instagram;