import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { encode } from "base64-arraybuffer";

interface FormData {
    name: string;
    comment: string;
    file: FileList;
    checked: boolean;
}

const convertBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export const AddImage = ({ close }: { close: () => void }) => {
    const handleClose = (e: any) => {
        if (e.target.id === 'wrapper') close();
    };

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ mode: 'onChange' });

    const onSubmit = handleSubmit(async ({ name, comment, file, checked }) => {
        if (file?.length === 0) return toast('You must select an image', { type: 'warning', hideProgressBar: true, autoClose: 2000 });
        if (!checked) return toast('You must agree to the terms and conditions', { type: 'warning', hideProgressBar: true, autoClose: 2000 });

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, { name, comment, file: encode(await file[0].arrayBuffer()), filename: v4().concat('.').concat(file[0].name.split('.').pop() as string), filetype: file[0].type }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status === 200) {
                    toast('Image uploaded successfully', { type: 'success', hideProgressBar: true, autoClose: 3000 });
                    close();
                }
            })
            .catch(err => {
                console.log(err);
                toast('Something went wrong', { type: 'error', hideProgressBar: true });
                close();
            });
    });

    return (
        <div className="fixed insert-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center w-full h-full z-50" id='wrapper' onClick={handleClose}>
            <div className="w-[600px]">
                <div className="bg-white p-2 rounded">
                    <div className="px-6 py-6 lg:px-8 text-left">
                        <h3 className="text-xl font-semibold text-gray-900 mb-5">
                            Add Image
                        </h3>
                        <form action="#" className="space-y-6" onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register('name', { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                    style={{ borderColor: errors.name ? 'red' : '' }}
                                />
                                {errors.name && <span className="text-red-500">This field is required</span>}
                            </div>
                            <div>
                                <label htmlFor="comment" className="text-sm font-bold text-gray-600 block">Comment</label>
                                <input
                                    type="text"
                                    id="comment"
                                    {...register('comment', { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                    style={{ borderColor: errors.comment ? 'red' : '' }}
                                />
                                {errors.comment && <span className="text-red-500">This field is required</span>}
                            </div>
                            <div>
                                <label htmlFor="file" className="text-sm font-bold text-gray-600 block">Image</label>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    {...register('file')}
                                    className="w-full p-2 border border-gray-300 rounded mt-1"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="checked"
                                            {...register('checked')}
                                            className="h-4 w-4 text-blue-300 rounded"
                                        />
                                        <label htmlFor="checkbox" className="ml-2 text-sm text-gray-600">I have read and agree to the <a href="#" className="text-blue-400">Privacy Policy</a> and <a href='#' className="text-blue-400">Terms of Service</a>.</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
