import Navbar from "@/components/Navbar"
import { useState } from "react"
import FileUploadField from "./FileUploadField";
import axios from "axios";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ABI, contractAddress } from "@/utils/contractDetails";
import * as cryptojs from 'crypto-js';
import { LoaderCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface MovieDetails {
    movieName: string;
    movieDescription: string;
    price: string;
    age: string;
    releaseDate: string;
    genre: string;
}

console.log(contractAddress)

interface FileState {
    movie: File | null;
    trailer: File | null;
    poster: File | null;
}

interface PreviewState {
    movie: string | null;
    trailer: string | null;
    poster: string | null;
}

interface UploadProgress {
    movie: boolean;
    trailer: boolean;
    poster: boolean;
}



const MovieUpload = () => {

    const navigate = useNavigate();
    const [details, setDetails] = useState<MovieDetails>({
        movieName: "",
        movieDescription: "",
        price: "",
        age: "",
        releaseDate: "",
        genre: ""
    });

    const {address} = useAccount();

    const [status, setStatus] = useState<string>("");
    const [, setEncryptedFile] = useState<Blob | null>(null);
    const [, setIpfsHash] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        movie: false,
        trailer: false,
        poster: false
    });
    const [isUploading, setIsUploading] = useState(false);

    const password = import.meta.env.VITE_REACT_MOVIE_PASSWORD || '';

    const [previews, setPreviews] = useState<PreviewState>({
        movie: null,
        trailer: null,
        poster: null
    });

    const [files, setFiles] = useState<FileState>({
        movie: null,
        trailer: null,
        poster: null
    });

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>, type: keyof FileState) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => ({
                ...prev,
                [type]: previewUrl
            }));
            setFiles(prev => ({
                ...prev,
                [type]: file
            }));
        }
    }

    const removeFile = (type: keyof FileState) => {
        if (previews[type]) {
            URL.revokeObjectURL(previews[type] || '');
            setPreviews(prev => ({
                ...prev,
                [type]: null
            }));
            setFiles(prev => ({
                ...prev,
                [type]: null
            }));
        }
    }

    const { writeContract, isPending, data: hash } = useWriteContract();
    const { isSuccess, isError } = useWaitForTransactionReceipt({ hash });

    const encryptFile = (fileToEncrypt: File, userPassword: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const base64data = btoa(
                        new Uint8Array(e.target?.result as ArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );

                    const encrypted = cryptojs.AES.encrypt(base64data, userPassword).toString();

                    const encryptedBlob = new Blob([encrypted], { type: 'text/plain' });

                    setEncryptedFile(encryptedBlob);
                    resolve(encryptedBlob);
                } catch (error) {
                    console.error('Encryption error:', error);
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(fileToEncrypt);
        });
    };

    const uploadToPinata = async (file: File | Blob, type: keyof UploadProgress): Promise<string> => {
        try {
            setUploadProgress(prev => ({ ...prev, [type]: true }));

            const formData = new FormData();
            formData.append('file', file);

            const pinataOptions = JSON.stringify({ cidVersion: 1 });
            formData.append('pinataOptions', pinataOptions);

            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${import.meta.env.VITE_REACT_JWT_SECRET}`
                    }
                }
            );

            const ipfsHash = `ipfs://${response.data.IpfsHash}`;
            setIpfsHash(ipfsHash);

            setUploadProgress(prev => ({ ...prev, [type]: false }));
            return ipfsHash;
        } catch (error) {
            console.error('Pinata upload error:', error);
            setUploadProgress(prev => ({ ...prev, [type]: false }));
            throw new Error('Failed to upload file to IPFS');
        }
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setStatus('');

        try {
            if (!files.movie || !files.trailer || !files.poster) {
                setStatus('Please upload all required files');
                setIsUploading(false);
                return;
            }

            const movieHash = await handleEncryptAndUpload(files.movie);
            const trailerHash = await uploadToPinata(files.trailer, 'trailer');
            const posterHash = await uploadToPinata(files.poster, 'poster');

            console.log(movieHash,trailerHash,posterHash)
            const res = await writeContract({
                abi: ABI,
                address: contractAddress,
                functionName: "addMovie",
                args: [
                    details.movieName,
                    details.movieDescription,
                    details.price,
                    movieHash.replace("ipfs://", ""),
                    trailerHash.replace("ipfs://", ""),
                    posterHash.replace("ipfs://", "")
                ],
                account : address
            });
            console.log(res);
            console.log("done transaction")
        } catch (error) {
            console.error('Upload error:', error);
            setStatus('Failed to upload movie');
        } finally {
            setIsUploading(false);
        }
    }

    const handleEncryptAndUpload = async (file: File | null) => {
        if (!file || !password) {
            throw new Error('No file or password provided');
        }

        try {
            setUploadProgress(prev => ({ ...prev, movie: true }));
            setStatus('Encrypting file...');
            const encryptedBlob = await encryptFile(file, password);

            setStatus('Uploading to Pinata...');
            const ipfsHash = await uploadToPinata(encryptedBlob, 'movie');

            setStatus('File successfully encrypted and uploaded to IPFS');
            setUploadProgress(prev => ({ ...prev, movie: false }));
            return ipfsHash;
        } catch (error) {
            setUploadProgress(prev => ({ ...prev, movie: false }));
            console.error('Encryption/Upload error:', error);
            setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    // Render loading, error, or success states
    if (isError) return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
            <XCircle className="w-16 h-16 mb-4" />
            <p>Error while uploading</p>
            <div><button onClick={() => navigate('/home')}>Home</button></div>
        </div>
    );

    if (isSuccess) return (
        <div className="flex flex-col items-center justify-center h-screen text-green-500">
            <CheckCircle2 className="w-16 h-16 mb-4" />
            <p>Uploaded Successfully</p>
            <div><button onClick={() => navigate('/home')}>Home</button></div>
        </div>
    );

    if (isPending) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <LoaderCircle className="w-16 h-16 mb-4 animate-spin text-[#1EFF00]" />
            <p className="text-white">Processing...</p>
        </div>
    );

    return (
        <div className="flex flex-col">
            <Navbar />
            <div className="bg-[#292929] flex flex-col justify-around gap-y-12 p-10 mx-28 rounded-md font-hanalei text-white">
                <div className="text-center text-[#1EFF00] text-3xl">Upload A Movie</div>

                {status && (
                    <div className={`text-center p-2 rounded ${status.includes('error') ? 'bg-red-500' : 'bg-[#1EFF00] text-black'
                        }`}>
                        {status}
                    </div>
                )}

                <div className="flex justify-around">
                    <div className="flex flex-col gap-y-10 items-center">
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="movieName">Movie Name</label>
                            <input
                                className="p-1 rounded-md bg-[#3b3b3b] w-80"
                                type="text"
                                value={details.movieName}
                                id="movieName"
                                name="movieName"
                                onChange={changeHandler}
                                disabled={isUploading}
                            />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="movieDescription">Movie Description</label>
                            <input
                                className="p-1 rounded-md bg-[#3b3b3b] w-80"
                                type="text"
                                value={details.movieDescription}
                                id="movieDescription"
                                name="movieDescription"
                                onChange={changeHandler}
                                disabled={isUploading}
                            />
                        </div>
                        <FileUploadField
                            label="Upload Movie"
                            onChange={(e : any) => changeFileHandler(e, 'movie')}
                            preview={previews.movie}
                            onRemove={() => removeFile('movie')}
                            accept="video/*"
                            type="video"
                            isUploading={uploadProgress.movie}
                            disabled={isUploading}
                        />
                    </div>
                    <div className="flex flex-col gap-y-10 items-center">
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="price">Price</label>
                            <input
                                className="p-1 rounded-md bg-[#3b3b3b] w-80"
                                type="text"
                                value={details.price}
                                id="price"
                                name="price"
                                onChange={changeHandler}
                                disabled={isUploading}
                            />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="age">Age Category</label>
                            <input
                                className="p-1 rounded-md bg-[#3b3b3b] w-80"
                                type="text"
                                value={details.age}
                                id="age"
                                name="age"
                                onChange={changeHandler}
                                disabled={isUploading}
                            />
                        </div>
                        <FileUploadField
                            label="Upload Trailer"
                            onChange={(e : any) => changeFileHandler(e, 'trailer')}
                            preview={previews.trailer}
                            onRemove={() => removeFile('trailer')}
                            accept="video/*"
                            type="video"
                            isUploading={uploadProgress.trailer}
                            disabled={isUploading}
                        />
                    </div>
                    <div className="flex flex-col gap-y-10 items-center">
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="releaseDate">Release Date</label>
                            <input
                                className="p-1 rounded-md bg-[#3b3b3b] w-80"
                                type="text"
                                value={details.releaseDate}
                                id="releaseDate"
                                name="releaseDate"
                                onChange={changeHandler}
                                disabled={isUploading}
                            />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="genre">Genre</label>
                            <input
                                className="p-1 rounded-md bg-[#3b3b3b] w-80"
                                type="text"
                                value={details.genre}
                                id="genre"
                                name="genre"
                                onChange={changeHandler}
                                disabled={isUploading}
                            />
                        </div>
                        <FileUploadField
                            label="Movie Poster"
                            onChange={(e : any) => changeFileHandler(e, 'poster')}
                            preview={previews.poster}
                            onRemove={() => removeFile('poster')}
                            accept="image/*"
                            type="image"
                            isUploading={uploadProgress.poster}
                            disabled={isUploading}
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className={`
                            ${isUploading
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#1EFF00] hover:bg-[#19CC00]'
                            } 
                            text-black px-6 py-2 rounded-md transition-colors flex items-center gap-2
                        `}
                        onClick={(e) => submitHandler(e)}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <LoaderCircle className="animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            'Upload'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieUpload;