# Deepfake Detection

### A Full-Stack Deepfake Detection Application developed with FastAPI, Tensorflow, OpenCV, React.js, and Tailwind CSS

## To run this project locally:
#### Pre-requisites: Python (>=3.10), Node.js (>=18.19)

* Clone this repository
```bash
git clone https://github.com/Aryanv45/deepface-detection.git
cd deepfake-detection
* Setup python virtual environment and install dependencies
```bash
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirements.txt
* Install frontend dependencies (present inside cilent directory)
```
pip install -r requirements.txt
```

cd client
npm install
```

* Go to parent directory (where app.py is located) and run the FastAPI server using:
```
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Now our FastAPI server must be running on localhost:8000 (make sure that your port 8000 is free before running previous command).

* Go to client directory and create another terminal (where package.json is located) and run the React App using:
```
npm run dev
```
Now our React App must be running on localhost:5173 (or on any port >5173 if it is not free).

