import React, { useRef, useEffect, useState } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Prefer back camera
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError('Could not access camera. Please allow permissions.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const processImage = (canvas: HTMLCanvasElement) => {
    // Get base64 string in JPEG format
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const base64 = dataUrl.split(',')[1];
    onCapture(base64);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas dimensions to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        processImage(canvas);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvasRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current!;
          // Resize if too huge to prevent massive payloads
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;
          
          if (width > maxDim || height > maxDim) {
             if (width > height) {
                 height = (height / width) * maxDim;
                 width = maxDim;
             } else {
                 width = (width / height) * maxDim;
                 height = maxDim;
             }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            processImage(canvas);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if needed
    event.target.value = '';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white p-6 text-center flex-col">
        <p className="mb-4">{error}</p>
        <button 
          onClick={handleUploadClick}
          className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold"
        >
          Upload Photo Instead
        </button>
        <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="h-full w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="mt-8 text-center">
          <div className="inline-block bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <p className="text-white text-sm font-medium">Scan fridge or upload photo</p>
          </div>
        </div>

        {/* Scan reticle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white -mt-0.5 -ml-0.5"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white -mt-0.5 -mr-0.5"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white -mb-0.5 -ml-0.5"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white -mb-0.5 -mr-0.5"></div>
          </div>
        </div>

        <div className="mb-12 flex items-center justify-center pointer-events-auto space-x-8">
            {/* Upload Button */}
            <button 
                onClick={handleUploadClick}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 active:scale-95 transition-all hover:bg-white/30"
                aria-label="Upload Photo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {/* Shutter Button */}
            <button 
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full border-4 border-gray-200 shadow-lg flex items-center justify-center transform active:scale-95 transition-all"
                aria-label="Take Photo"
            >
                <div className="w-16 h-16 bg-green-500 rounded-full border-2 border-white"></div>
            </button>
            
            {/* Spacer to center the main button visually relative to container, 
                balancing the left button. */}
            <div className="w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default Camera;