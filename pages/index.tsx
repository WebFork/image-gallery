import Image from "next/image";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

import { AddImage } from "../components/AddImage";

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
}

type Image = {
  id: string
  name: string
  comment: string
  imageSrc: string
};

const Gallery = ({ images }: { images: Image[] }) => {
  const [addImageModalOpen, setAddImageModalOpen] = useState(false);

  return (
    <>
    {addImageModalOpen && <AddImage close={() => setAddImageModalOpen(false)} />}
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {images.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
          <div className="bg-gray-50 rounded-lg w-full mb-[4.2rem] flex items-center justify-center border border-gray-200 min-h-[16rem]">
            <p className="p-8 text-gray-500 text-lg leading-6">
              <a
                href="#"
                onClick={() => setAddImageModalOpen(true)}
                className="flex items-center justify-center hover:text-blue-600"
              >
                Add your photos
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const BlurImage = ({ image }: { image: Image }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <a href='#' className="group">
      <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          alt=""
          src={image.imageSrc}
          fill
          className={cn(
            'group-hover:opacity-75 object-cover duration-700 ease-in-out',
            isLoading
              ? 'grayscale blur-2xl scale-110'
              : 'grayscale-0 blur-0 scale-100'
          )}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{`@${image.name}`}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.comment}</p>
    </a>
  );
}

export const getStaticProps = async () => {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const { data } = await supabaseAdmin
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: {
      images: data,
    },
  };
}

export default Gallery;
