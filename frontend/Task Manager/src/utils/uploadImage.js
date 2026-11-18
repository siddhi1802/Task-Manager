import {API_PATHS} from './apiPaths';
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) => {

    if(!imageFile || !(imageFile instanceof File))
    {
        console.error("uploadingImage:imageFile is not a File object", imageFile);
        throw new Error("No file selected or file is not valid");
    }
    const formData = new FormData();
    formData.append ('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData
        );
        return response.data; //Return response data
    } catch (error) {
        console.error('Error uploading the image:', error);
        throw error; //Rethrow error for handling
    }
};

export default uploadImage;