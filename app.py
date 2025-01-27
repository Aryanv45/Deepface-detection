from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from features import predict_audio, predict_image, predict_video, predict_live_video_frame
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def home():
    return JSONResponse(content='API is running')

@app.post("/predictVideo")
async def predict_video_endpoint(video: UploadFile = File(...)):
    try:
        temp_file = f"temp_video_{video.filename}"
        with open(temp_file, "wb") as buffer:
            buffer.write(await video.read())
        
        prediction = predict_video(temp_file)
        
        return JSONResponse(content={"result": "fake" if prediction == 1 else "real"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.post("/predictImage")
async def predict_image_endpoint(image: UploadFile = File(...)):
    try:
        temp_file = f"temp_image_{image.filename}"
        with open(temp_file, "wb") as buffer:
            buffer.write(await image.read())
        
        prediction = predict_image(temp_file)
        
        return JSONResponse(content={"result": "fake" if prediction == 1 else "real"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.post("/predictAudio")
async def predict_audio_endpoint(audio: UploadFile = File(...)):
    try:
        temp_file = f"temp_audio_{audio.filename}"
        with open(temp_file, "wb") as buffer:
            buffer.write(await audio.read())
        
        prediction = predict_audio(temp_file)
        
        return JSONResponse(content={"result": "fake" if prediction else "real"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.post("/predictLiveVideoFrame")
async def predict_live_video_frame_endpoint(frame: UploadFile = File(...)):
    try:
        temp_file = f"temp_frame_{frame.filename}"
        with open(temp_file, "wb") as buffer:
            buffer.write(await frame.read())
        
        prediction = predict_live_video_frame(temp_file)
        
        return JSONResponse(content={"result": "fake" if prediction == 1 else "real"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)