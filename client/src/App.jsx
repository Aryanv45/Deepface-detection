import { useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsUpload, BsFileEarmarkMusic } from "react-icons/bs";
import { CiImageOn, CiVideoOn } from "react-icons/ci";
import { DNA } from 'react-loader-spinner';
import useHover from "./hooks/useHover";

const App = () => {
    const BASEURL = 'http://localhost:8000';

    const [videoUrl, setVideoUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLiveVideo, setIsLiveVideo] = useState(false);
    const [liveVideoResult, setLiveVideoResult] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [isHover, hoverRef] = useHover();
    const [isHover2, hoverRef2] = useHover();
    const [isHover3, hoverRef3] = useHover();

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setVideoUrl(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setAudioUrl(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const predictVideo = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('video', selectedFile);

            const postHeader = {
                method: "POST",
                body: formData
            };

            const res = await fetch(`${BASEURL}/predictVideo`, postHeader);
            const data = await res.json();
            setResult(data);
            setLoading(false);

            toast.success("Predicted Successfully");
        } catch (error) {
            toast.error("API Error!");
            setLoading(false);
            console.log(error);
        }
    };

    const predictImage = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('image', selectedFile);

            const postHeader = {
                method: "POST",
                body: formData
            };

            const res = await fetch(`${BASEURL}/predictImage`, postHeader);
            const data = await res.json();
            setResult(data);
            setLoading(false);

            toast.success("Predicted Successfully");
        } catch (error) {
            toast.error("API Error!");
            setLoading(false);
            console.log(error);
        }
    };

    const predictAudio = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('audio', selectedFile);

            const postHeader = {
                method: "POST",
                body: formData
            };

            const res = await fetch(`${BASEURL}/predictAudio`, postHeader);
            const data = await res.json();
            setResult(data);
            setLoading(false);

            toast.success("Predicted Successfully");
        } catch (error) {
            toast.error("API Error!");
            setLoading(false);
            console.log(error);
        }
    };

    const startLiveVideo = () => {
        setIsLiveVideo(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error("Error accessing webcam: ", err);
            });
    };

    const stopLiveVideo = () => {
        setIsLiveVideo(false);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const captureFrame = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasRef.current.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('frame', blob, 'frame.jpg');

                try {
                    setLoading(true);
                    const response = await fetch(`${BASEURL}/predictLiveVideoFrame`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const result = await response.json();
                    setLiveVideoResult(result);
                    setLoading(false);
                    toast.success("Live video frame predicted successfully");
                } catch (error) {
                    console.error('Error predicting live video frame:', error);
                    toast.error("API Error!");
                    setLoading(false);
                }
            }, 'image/jpeg');
        }
    };

    const reset = () => {
        setVideoUrl('');
        setImageUrl('');
        setAudioUrl('');
        setSelectedFile(null);
        setResult('');
        setLiveVideoResult(null);
    };

    return (
        <div>
            {!loading ? 
            <div className="min-h-screen min-w-full flex flex-col gap-3 items-center justify-center p-4 bg-[#EBEEF5]">
                <div className="text-2xl sm:text-4xl text-center absolute top-10 inset-x-0">Deepfake Detection</div>

                {!videoUrl && !imageUrl && !audioUrl && !isLiveVideo ? 
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <div className="size-52">
                        <label ref={hoverRef} className="flex flex-col-reverse items-center justify-center gap-3 size-52 rounded-xl p-3 border-2 border-black/70 border-dashed cursor-pointer hover:scale-105 duration-150">
                            <div className="text-center text-3xl">Upload Video</div>
                            <div>
                                {!isHover ? <CiVideoOn size={70}/> : <BsUpload size={70}/>}
                            </div>
                            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden"/>
                        </label>
                    </div>

                    <div className="size-52">
                        <label ref={hoverRef2} className="flex flex-col-reverse items-center justify-center gap-3 size-52 rounded-xl p-3 border-2 border-black/70 border-dashed cursor-pointer hover:scale-105 duration-150">
                            <div className="text-center text-3xl">Upload Image</div>
                            <div>
                                {!isHover2 ? <CiImageOn size={70}/> : <BsUpload size={70}/>}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                        </label>
                    </div>

                    <div className="size-52">
                        <label ref={hoverRef3} className="flex flex-col-reverse items-center justify-center gap-3 size-52 rounded-xl p-3 border-2 border-black/70 border-dashed cursor-pointer hover:scale-105 duration-150">
                            <div className="text-center text-3xl">Upload Audio</div>
                            <div>
                                {!isHover3 ? <BsFileEarmarkMusic size={70}/> : <BsUpload size={70}/>}
                            </div>
                            <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden"/>
                        </label>
                    </div>

                    <div className="size-52">
                        <button onClick={startLiveVideo} className="flex flex-col-reverse items-center justify-center gap-3 size-52 rounded-xl p-3 border-2 border-black/70 border-dashed cursor-pointer hover:scale-105 duration-150">
                            <div className="text-center text-3xl">Start Live Video</div>
                            <CiVideoOn size={70}/>
                        </button>
                    </div>
                </div> : 
                <div className="hidden">
                    <div ref={hoverRef}/>
                    <div ref={hoverRef2}/>
                    <div ref={hoverRef3}/>
                </div>}

                {videoUrl && (
                    <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mt-32 flex items-center justify-center">
                        <video controls className="rounded-2xl">
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {imageUrl && (
                    <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mt-32 flex items-center justify-center">
                        <img src={imageUrl} alt="" className="rounded-2xl"/>
                    </div>
                )}

                {audioUrl && (
                    <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mt-32 flex items-center justify-center">
                        <audio controls className="rounded-2xl">
                            <source src={audioUrl} type="audio/wav" />
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                )}

                {isLiveVideo && (
                    <div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mt-32 flex flex-col items-center justify-center">
                        <video ref={videoRef} autoPlay className="rounded-2xl w-full"></video>
                        <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
                        <button onClick={captureFrame} className="mt-4 rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Capture Frame</button>
                        <button onClick={stopLiveVideo} className="mt-4 rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Stop Live Video</button>
                    </div>
                )}

                {result && (
                    result.result === "real" ? <div className="text-2xl flex items-center gap-2">Prediction Result: <span className="font-bold text-green-500">Real</span></div> : 
                    (result.result === "fake" ? <div className="text-2xl flex items-center gap-2">Prediction Result: <span className="font-bold text-red-500">Fake</span></div> : 
                    <div className="text-2xl flex items-center gap-2">Prediction Result: <span className="font-bold text-neutral-700">No face Detected</span></div>)
                )}

                {liveVideoResult && (
                    liveVideoResult.result === "real" ? <div className="text-2xl flex items-center gap-2">Live Video Frame Prediction Result: <span className="font-bold text-green-500">Real</span></div> : 
                    (liveVideoResult.result === "fake" ? <div className="text-2xl flex items-center gap-2">Live Video Frame Prediction Result: <span className="font-bold text-red-500">Fake</span></div> : 
                    <div className="text-2xl flex items-center gap-2">Live Video Frame Prediction Result: <span className="font-bold text-neutral-700">No face Detected</span></div>)
                )}

                <div className="flex items-center justify-center gap-2">
                    {videoUrl || imageUrl || audioUrl || isLiveVideo ? <button onClick={reset} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Try another</button> : null}

                    {videoUrl && !result ? <button onClick={predictVideo} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Predict Video!</button> : null}

                    {imageUrl && !result ? <button onClick={predictImage} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Predict Image!</button> : null}

                    {audioUrl && !result ? <button onClick={predictAudio} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Predict Audio!</button> : null}
                </div>

            </div> : 
            <div className="min-h-screen min-w-full flex flex-col items-center justify-center bg-[#EBEEF5]">
                <DNA
                    visible={true}
                    height="200"
                    width="200"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
                <h1>Be patient, It may take a while...</h1>
            </div>}
            <ToastContainer/>
        </div>
    );
};

export default App;